import express from "express";
import {
  googleAuth,
  googleAuthCallback,
  getUserProfile,
  logout,
} from "./userController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/profile", isAuthenticated, getUserProfile);
router.post("/logout", logout);

export default router;
