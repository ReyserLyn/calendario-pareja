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
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { LoginForm } from "./loginForm";
import { UserDropdown } from "./userDropDown";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [temporalChanges, setTemporalChanges] = useState<Record<
    string,
    any
  > | null>(null);

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

  const handleSaveChanges = () => {
    console.log("Guardando cambios:", temporalChanges);
    setIsEditing(false);
    setTemporalChanges(null);
  };

  const handleCancelChanges = () => {
    console.log("Cancelando cambios");
    setIsEditing(false);
    setTemporalChanges(null);
  };
  const handleEditClick = () => {
    console.log("Entrando en modo edición");
    setIsEditing(true);
    setTemporalChanges({});
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
                  onClick={() => {
                    if (isEditing) {
                      handleSaveChanges();
                    } else {
                      handleEditClick();
                    }
                  }}
                >
                  {isEditing ? (
                    <>
                      <FaSave className="h-5 w-5" />
                      <span className="hidden sm:inline">Guardar</span>
                    </>
                  ) : (
                    <>
                      <FaEdit className="h-5 w-5" />
                      <span className="hidden sm:inline">Editar</span>
                    </>
                  )}
                </Button>

                {isEditing && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelChanges}
                    className="gap-2"
                    size="sm"
                  >
                    <FaTimes className="h-4 w-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </Button>
                )}
              </div>
            </>
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
