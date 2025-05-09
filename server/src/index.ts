import express from "express";
import { db } from "./db";
import { users } from "./db/schema";

const app = express();

app.get("/ping", (req, res) => {
  res.json({ message: "Pong" });
});

app.get("/users", async (req, res) => {
  const user = await db.select().from(users);
  res.json({ ussers: user });
});

app.listen(8080, () => console.log("Listening on port :8080"));
