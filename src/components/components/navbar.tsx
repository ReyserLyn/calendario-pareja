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
    <header className=" absolute w-full flex items-center justify-between px-6 py-4 z-50">
      <div className="flex items-center">
        <Image
          src="/img/logo.webp"
          alt="Logo"
          className="h-12 w-auto"
          width={100}
          height={32}
        />
      </div>

      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Iniciar sesión</Button>
          </DialogTrigger>
          <DialogTitle className="sr-only">Iniciar sesión</DialogTitle>
          <DialogContent
            className="max-w-3xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
            hideClose
          >
            <LoginForm />
          </DialogContent>
          <DialogDescription className="sr-only">
            Iniciar sesión en calendario parejas
          </DialogDescription>
        </Dialog>
        <ToggleTheme />
      </div>
    </header>
  );
}
