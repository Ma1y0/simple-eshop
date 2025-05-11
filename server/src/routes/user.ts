import { Router } from "express";
import { doAuth } from "../middleware";

const router = Router();

// /api/v1/user/me
router.get("/me", doAuth, (req, res) => {
  res.json({ message: "User found", data: req.user });
});

export default router;
