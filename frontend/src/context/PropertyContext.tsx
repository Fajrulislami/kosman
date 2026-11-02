"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatWhatsAppNumber } from "@/lib/whatsapp";

export interface PropertyProfile {
  name: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  description: string;
  mapsUrl: string;
}

const defaultProfile: PropertyProfile = {
  name: "Pondok Rahmat",
  phone: "+62 853-9740-3115",
  secondaryPhone: "+62 831-2350-1171",
  address: "Romangpolong, Samata (Samping UIN Samata dekat Pintu II), Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92113",
  description: "Kost Putri Nyaman, Bersih, dan Strategis Dekat Kampus II UIN Samata.",
  mapsUrl: "https://maps.app.goo.gl/mHwa7ppvN4231RZz5?g_st=aw",
};

interface PropertyContextType {
  profile: PropertyProfile;
  isLoading: boolean;
  rawPhone: string;
  waUrl: (message?: string) => string;
  refreshProfile: () => void;
}

const PropertyContext = createContext<PropertyContextType>({
  profile: defaultProfile,
  isLoading: true,
  rawPhone: "6285397403115",
  waUrl: () => "https://wa.me/6285397403115",
  refreshProfile: () => {},
});

export const PropertyProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<PropertyProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = () => {
    apiFetch<{ data?: { profile?: Partial<PropertyProfile> } }>("/api/settings")
      .then((res) => {
        const profileData = res?.data?.profile;
        if (profileData) {
          setProfile((prev) => ({
            ...prev,
            ...profileData,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load public settings:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();

    const handleUpdated = (e: any) => {
      if (e?.detail) {
        setProfile((prev) => ({
          ...prev,
          ...e.detail,
        }));
      } else {
        fetchProfile();
      }
    };

    window.addEventListener("kostara_settings_updated", handleUpdated);
    return () => {
      window.removeEventListener("kostara_settings_updated", handleUpdated);
    };
  }, []);

  const rawPhone = profile.phone ? formatWhatsAppNumber(profile.phone) : "6285397403115";
  
  const waUrl = (message?: string) => {
    return message
      ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${rawPhone}`;
  };

  return (
    <PropertyContext.Provider
      value={{
        profile,
        isLoading,
        rawPhone,
        waUrl,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => useContext(PropertyContext);
