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
import { pocketbaseClient } from "@/lib/pocketbase";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LoginForm } from "./loginForm";
import { UserDropdown } from "./userDropDown";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await pocketbaseClient.validateAuth();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Error al validar la autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
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

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
          {isAuthenticated ? (
            <UserDropdown onLogout={handleLogout} />
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Iniciar sesión</Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-3xl"
                onOpenAutoFocus={(e) => e.preventDefault()}
                hideClose
              >
                <DialogTitle className="sr-only">Iniciar sesión</DialogTitle>

                <LoginForm
                  onClose={() => setIsDialogOpen(false)}
                  onLogin={handleLogin}
                />

                <DialogDescription className="sr-only">
                  Iniciar sesión en calendario parejas
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}

          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
