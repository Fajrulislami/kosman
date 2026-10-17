import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.siteSetting.findMany();
    
    const config: Record<string, any> = {};
    settings.forEach((s) => {
      try {
        config[s.key] = JSON.parse(s.value);
      } catch (e) {
        config[s.key] = s.value;
      }
    });

    res.json({ data: config });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Gagal memuat pengaturan" });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    
    if (typeof updates !== 'object' || updates === null) {
      res.status(400).json({ error: "Format data tidak valid" });
      return;
    }

    const transaction = Object.entries(updates).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue }
      });
    });

    await prisma.$transaction(transaction);

    res.json({ success: true, message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Gagal menyimpan pengaturan" });
  }
};
