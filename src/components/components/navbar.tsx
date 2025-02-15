"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleTheme } from "@/components/ui/toogle-theme";
import Image from "next/image";
import { LoginForm } from "./loginForm";

export default function Navbar() {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Iniciar sesión</Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-3xl"
              onOpenAutoFocus={(e) => e.preventDefault()}
              hideClose
            >
              <DialogTitle className="sr-only">Iniciar sesión</DialogTitle>

              <LoginForm />

              <DialogDescription className="sr-only">
                Iniciar sesión en calendario parejas
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
