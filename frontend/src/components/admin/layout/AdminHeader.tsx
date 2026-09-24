"use client";

import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-[#E5E3DE] bg-white/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button (can add functionality later) */}
      <button type="button" className="-m-2.5 p-2.5 text-[#6B716D] lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-[#E5E3DE] lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search Bar */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Cari sesuatu...
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-[#99A09C]"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-[#1F3D35] placeholder:text-[#99A09C] focus:ring-0 sm:text-sm"
            placeholder="Cari penghuni, nomor kamar, atau tagihan..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notification Button */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-[#99A09C] transition-colors hover:text-[#1F3D35]"
          >
            <span className="sr-only">View notifications</span>
            <div className="relative">
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-[#E54D2E] ring-2 ring-white" />
            </div>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[#E5E3DE]" aria-hidden="true" />

          {/* Profile Dropdown (Static for now) */}
          <div className="flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-[#C69C6D] flex items-center justify-center text-white font-bold">
              AD
            </div>
            <span className="hidden lg:ml-3 lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-[#1F3D35]">
              Admin Pondok Rahmat
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
