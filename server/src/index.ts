import express from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import InventoryRouter from "./routes/inventory.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/invetory", InventoryRouter);

app.get("/api/v1/ping", (req, res) => {
  res.json({ message: "Pong" });
});

app.listen(8080, () => console.log("Listening on port :8080"));
