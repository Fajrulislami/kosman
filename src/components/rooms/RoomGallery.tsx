"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface RoomGalleryProps {
  images: string[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    // Memberikan efek parallax sederhana saat di-scroll
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pastikan kita memiliki setidaknya 3 gambar untuk bento grid
  const mainImage = images[0] || "/images/placeholder.jpg";
  const smallImage1 = images[1] || "/images/placeholder.jpg";
  const smallImage2 = images[2] || "/images/placeholder.jpg";

  return (
    <section className="mb-16 md:mb-24 w-full">
      <div className="grid h-[50vh] min-h-[400px] w-full grid-cols-1 gap-4 md:h-[65vh] md:min-h-[500px] md:grid-cols-3">
        
        {/* Gambar Utama (Kiri, lebih besar) */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl md:col-span-2">
          <Image
            src={mainImage}
            alt="Foto Kamar Utama"
            fill
            priority
            className="object-cover transition-transform duration-1000 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>

        {/* Kolom Kanan (2 Gambar Kecil bertumpuk) dengan efek Parallax ringan */}
        <div className="hidden h-full flex-col gap-4 md:flex">
          <div 
            className="relative h-1/2 w-full overflow-hidden rounded-2xl"
            style={{ transform: `translateY(${offsetY * 0.05}px)` }}
          >
            <Image
              src={smallImage1}
              alt="Foto Kamar Detail 1"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              sizes="33vw"
            />
          </div>
          
          <div 
            className="relative h-1/2 w-full overflow-hidden rounded-2xl"
            style={{ transform: `translateY(${offsetY * 0.02}px)` }}
          >
            <Image
              src={smallImage2}
              alt="Foto Kamar Detail 2"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              sizes="33vw"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
