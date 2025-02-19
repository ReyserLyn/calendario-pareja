"use client";

import { ToggleTheme } from "@/components/ui/toogle-theme";
import { useEditing } from "@/context/editing-context";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSessions";
import { uploadPhotos } from "@/lib/upload-photos";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import AuthSection from "./auth-section";
import NavbarLoading from "./navbar-loading";

export default function Navbar() {
  const sessionId = useSession();
  const { isAuthenticated, isLoading, handleLogout, handleLogin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isEditing, setIsEditing, temporalPhotos, setTemporalPhotos } =
    useEditing();

  const handleSaveChanges = async () => {
    try {
      if (!sessionId) throw new Error("No hay una sesión activa");
      await uploadPhotos(sessionId, temporalPhotos);
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
    return <NavbarLoading />;
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
          <AuthSection
            isAuthenticated={isAuthenticated}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isEditing={isEditing}
            onLogout={handleLogout}
            onLogin={handleLogin}
            onStartEditing={() => setIsEditing(true)}
            onSaveChanges={handleSaveChanges}
            onCancelChanges={handleCancelChanges}
          />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
