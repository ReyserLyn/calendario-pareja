"use client";

import { Button } from "@/components/ui/button";
import { ToggleTheme } from "@/components/ui/toogle-theme";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/img/logo.webp"
              alt="Logo"
              width={100}
              height={32}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <ToggleTheme />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h1 className="text-7xl sm:text-9xl font-bold tracking-tighter mb-4">
          404
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold mb-4">
          Oops, parece que te perdiste...
        </p>
        <p className="text-lg text-muted-foreground max-w-lg mb-8">
          La página que buscas no existe o fue eliminada. Pero no te preocupes,
          puedes volver a la página principal.
        </p>

        <Link href="/">
          <Button className="px-6 py-3 text-lg font-medium shadow-md transition hover:scale-105">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
