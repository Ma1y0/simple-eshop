import { NextFunction, Request, Response } from "express";
import { db } from "./db";
import { sessions, users } from "./db/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
      };
    }
  }
}

export const doAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sessionId = req.cookies.session;

    // No session cookie found
    if (!sessionId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Find the session
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    // Check if session expired
    if (new Date(session[0].expiresAt) < new Date()) {
      // Delete expired session
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      res.clearCookie("session");
      res.status(401).json({ message: "Session expired" });
      return;
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, session[0].userId))
      .limit(1);

    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Add user to request object
    req.user = user[0];

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
