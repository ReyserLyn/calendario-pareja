// components/components/navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ToggleTheme } from "@/components/ui/toogle-theme";
import { useEditing } from "@/context/EditingContext"; // Importar el contexto
import { pocketbaseClient } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { LoginForm } from "./loginForm";
import { UserDropdown } from "./userDropDown";

declare global {
  interface Window {
    saveCalendarChanges: () => Promise<void>;
  }
}

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Usar el contexto
  const { isEditing, setIsEditing } = useEditing();

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

  // Manejar cierre de sesión
  const handleLogout = () => {
    pocketbaseClient.logout();
    setIsAuthenticated(false);
  };

  // Manejar inicio de sesión exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsDialogOpen(false); // Cerrar el diálogo después del login
  };

  // Entrar en modo edición
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Mostrar loader mientras se verifica la autenticación
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

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <UserDropdown onLogout={handleLogout} />
              <div className="flex items-center gap-2">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2",
                    isEditing && "bg-green-600 hover:bg-green-700 text-white"
                  )}
                  size="sm"
                  onClick={handleEditClick}
                >
                  <FaEdit className="h-5 w-5" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
              </div>
            </>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Iniciar sesión</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <LoginForm
                  onClose={() => setIsDialogOpen(false)}
                  onLogin={handleLogin}
                />
              </DialogContent>
            </Dialog>
          )}
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
