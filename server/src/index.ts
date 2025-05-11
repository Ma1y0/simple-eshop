import express from "express";
import { db } from "./db";
import { users } from "./db/schema";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);

app.get("/api/v1/ping", (req, res) => {
  res.json({ message: "Pong" });
});

app.get("/users", async (req, res) => {
  const user = await db.select().from(users);
  res.json({ ussers: user });
});

app.listen(8080, () => console.log("Listening on port :8080"));
