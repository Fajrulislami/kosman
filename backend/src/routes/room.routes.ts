import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import {
  getPublicRooms,
  getPublicRoomDetail,
  getAdminRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller";

export const roomRouter = Router();

// Public Routes
roomRouter.get("/public/rooms", getPublicRooms);
roomRouter.get("/public/rooms/:slug", getPublicRoomDetail);

// Admin Routes
roomRouter.get("/admin/rooms", requireAdmin, getAdminRooms);
roomRouter.post("/admin/rooms", requireAdmin, createRoom);
roomRouter.put("/admin/rooms/:id", requireAdmin, updateRoom);
roomRouter.delete("/admin/rooms/:id", requireAdmin, deleteRoom);
