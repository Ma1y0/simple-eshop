import { password } from "bun";
import { Router } from "express";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password: passwordText } = req.body;
    if (!name || !email || !passwordText) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }

    const passwordHash = await password.hash(passwordText);
    const userId = await db
      .insert(users)
      .values({
        name,
        email,
        password: passwordHash,
      })
      .returning({ id: users.id });

    res
      .status(201)
      .json({ message: "User created successfully", userId: userId[0].id });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password: passwordText } = req.body;

    if (!email || !passwordText) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Verify
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user.length !== 1) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await password.verify(passwordText, user[0].password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Create session
    const sessionId = Bun.randomUUIDv7();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    res.json({
      message: "Loggin successfully",
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Failed to login user" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.cookies.session;

    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }

    // Clear cookie
    res.clearCookie("session");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
});

export default router;
