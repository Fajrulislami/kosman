import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { login, logout, getMe, googleLogin } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/google-login", googleLogin);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, getMe);
