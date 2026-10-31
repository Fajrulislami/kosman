"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { Bed, ImageOff } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackLabel?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
  fallbackLabel = "Pondok Rahmat",
  className = "",
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E5E3DE] to-[#D5D3CC] p-4 text-center select-none ${className}`}
      >
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
          <Bed className="h-6 w-6 text-[#C69C6D]" />
        </div>
        <p className="text-xs font-bold tracking-wider text-[#1F3D35] uppercase">
          {fallbackLabel}
        </p>
        <span className="mt-1 text-[11px] text-[#6B716D]">Foto segera diperbarui</span>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${!isLoaded ? "bg-[#E5E3DE]/60 animate-pulse" : ""}`}>
      <Image
        {...rest}
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}

