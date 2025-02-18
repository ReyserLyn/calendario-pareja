"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ToggleTheme } from "@/components/ui/toogle-theme";
import { useEditing } from "@/context/EditingContext";
import { pocketbaseClient } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { LoginForm } from "./loginForm";
import { UserDropdown } from "./userDropDown";

export default function Navbar() {
  const pathname = usePathname();
  const sessionIdFromUrl = pathname.split("/")[1];

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isEditing, setIsEditing, temporalPhotos, setTemporalPhotos } =
    useEditing();

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const sessionId = sessionIdFromUrl || "0d5tth946j9me9c";
        setSessionId(sessionId);
      } catch (error) {
        console.error("Error fetching session ID:", error);
      }
    };

    fetchSessionId();
  }, [sessionIdFromUrl]);

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

  const handleLogout = () => {
    pocketbaseClient.logout();
    setIsAuthenticated(false);
    setIsEditing(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsDialogOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      if (!sessionId) throw new Error("No hay una sesión activa");

      const updates = Object.entries(temporalPhotos).map(
        async ([month, imageUrl]) => {
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${month}.webp`, { type: blob.type });

            await pocketbaseClient.uploadPhoto(
              sessionId,
              month as PhotosMonthOptions,
              file
            );
          } catch (error) {
            console.error(`Error al actualizar ${month}:`, error);
            throw error;
          }
        }
      );

      await Promise.all(updates);
      toast.success("Cambios guardados correctamente");
      setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
      setIsEditing(false);
    } catch (error) {
      toast.error("Error al guardar los cambios");
      console.error("Save error:", error);
    }
  };

  const handleCancelChanges = () => {
    setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
    setIsEditing(false);
    toast.info("Cambios cancelados");
  };

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
          priority
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
                  onClick={
                    isEditing ? handleSaveChanges : () => setIsEditing(true)
                  }
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
