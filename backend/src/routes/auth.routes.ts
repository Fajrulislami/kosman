import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { authLimiter, passwordChangeLimiter } from "../middlewares/rateLimiter";
import { login, logout, getMe, googleLogin, updateProfile, changePassword } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", authLimiter, login);
authRouter.post("/google-login", authLimiter, googleLogin);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, getMe);
authRouter.put("/profile", authMiddleware, updateProfile);
authRouter.put("/change-password", authMiddleware, passwordChangeLimiter, changePassword);


