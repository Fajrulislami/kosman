import { Router, Response } from "express";
import fs from "fs";
import path from "path";
import { requireAdmin, AuthenticatedRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

export const backupRouter = Router();

/**
 * Mencari lokasi file database SQLite (dev.db) secara andal
 */
function getDatabaseFilePath(): string | null {
  const candidatePaths = [
    path.resolve(process.cwd(), "prisma", "dev.db"),
    path.resolve(process.cwd(), "dev.db"),
    path.resolve(__dirname, "../../prisma/dev.db"),
    path.resolve(__dirname, "../prisma/dev.db"),
  ];

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:")) {
    const rawPath = process.env.DATABASE_URL.replace(/^file:/, "");
    candidatePaths.unshift(
      path.resolve(process.cwd(), "prisma", rawPath),
      path.resolve(process.cwd(), rawPath)
    );
  }

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

/**
 * Format bytes ke ukuran yang mudah dibaca (KB / MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * GET /api/admin/backup/stats
 * Mengembalikan informasi kesehatan database, ukuran file, dan ringkasan data
 */
backupRouter.get("/stats", requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const dbPath = getDatabaseFilePath();

    let fileSize = 0;
    let lastModified: string | null = null;

    if (dbPath && fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      fileSize = stats.size;
      lastModified = stats.mtime.toISOString();
    }

    const [totalRooms, totalTenants, totalInvoices, totalUsers] = await Promise.all([
      prisma.room.count(),
      prisma.tenant.count(),
      prisma.invoice.count(),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        databaseType: "SQLite",
        isHealthy: Boolean(dbPath),
        fileSize,
        fileSizeFormatted: formatFileSize(fileSize),
        lastModified,
        counts: {
          rooms: totalRooms,
          tenants: totalTenants,
          invoices: totalInvoices,
          users: totalUsers,
        },
      },
    });
  } catch (error) {
    console.error("Gagal membaca statistik backup:", error);
    res.status(500).json({ error: "Gagal mengambil statistik database" });
  }
});

/**
 * GET /api/admin/backup/download
 * Mengunduh salinan fisik database SQLite (.db) dengan proteksi admin
 */
backupRouter.get("/download", requireAdmin, async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const dbPath = getDatabaseFilePath();

    if (!dbPath || !fs.existsSync(dbPath)) {
      res.status(404).json({ error: "File database tidak ditemukan di server" });
      return;
    }

    // Format tanggal untuk nama file: YYYY-MM-DD
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const downloadFilename = `kostara-backup-${dateStr}.db`;

    res.setHeader("Content-Disposition", `attachment; filename="${downloadFilename}"`);
    res.setHeader("Content-Type", "application/x-sqlite3");

    // Menggunakan res.download dari Express untuk streaming file yang aman
    res.download(dbPath, downloadFilename, (err) => {
      if (err) {
        console.error("Error streaming database backup:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Gagal mengunduh file database" });
        }
      }
    });
  } catch (error) {
    console.error("Download backup error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Terjadi kesalahan saat memproses cadangan database" });
    }
  }
});

