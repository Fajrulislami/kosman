import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { authRouter } from "./routes/auth.routes";
import { roomRouter } from "./routes/room.routes";
import { tenantRouter } from "./routes/tenant.routes";
import { invoiceRouter } from "./routes/invoice.routes";
import { complaintRouter } from "./routes/complaint.routes";
import { analyticsRouter } from "./routes/analytics.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Kostara Property Management Backend",
    database: "SQLite (Local Testing)",
  });
});

// Register Routes
app.use("/api/auth", authRouter);
app.use("/api", roomRouter);
app.use("/api", tenantRouter);
app.use("/api", invoiceRouter);
app.use("/api", complaintRouter);
app.use("/api", analyticsRouter);

// Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Terjadi kesalahan internal pada server backend" });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Kostara Backend Server berjalan di http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
