"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function NavbarLoading() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Image
          src="/img/logo.webp"
          alt="Logo"
          width={100}
          height={32}
          className="h-12 w-auto"
        />
        <div className="flex items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    </header>
  );
}
