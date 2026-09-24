import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            status: true,
          },
        },
      },
      orderBy: { basePrice: "asc" },
    });

    const formatted = roomTypes.map((rt) => {
      const totalUnits = rt.rooms.length;
      const availableUnits = rt.rooms.filter((r) => r.status === "AVAILABLE").length;

      return {
        id: rt.id,
        slug: rt.slug,
        name: rt.name,
        price: rt.basePrice,
        deposit: rt.depositPrice,
        size: rt.size,
        description: rt.description,
        facilities: rt.facilities,
        images: rt.images,
        totalUnits,
        availableUnits,
        isAvailable: availableUnits > 0,
      };
    });

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Public rooms API error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data katalog kamar" },
      { status: 500 }
    );
  }
}
