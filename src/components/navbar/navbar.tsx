"use client";

import { useEditing } from "@/context/editing-context";
import { usePhotosContext } from "@/context/photos-context";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSessions";
import { uploadPhotos } from "@/lib/uploadPhotos";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { ToggleTheme } from "../ui/toogle-theme";
import AuthSection from "./auth-section";
import NavbarLoading from "./navbar-loading";

export const Navbar: React.FC = () => {
  const { sessionId } = useSession();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    handleLogout,
    handleLogin,
  } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    isEditing,
    setIsEditing,
    temporalPhotos,
    setTemporalPhotos,
    deletedPhotos,
    setDeletedPhotos,
  } = useEditing();
  const { resetPhotos, reloadPhotos } = usePhotosContext();

  const handleSaveChanges = useCallback(async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      if (!sessionId) throw new Error("No hay una sesión activa");

      // Guardar cambios en la base de datos
      await uploadPhotos(sessionId, temporalPhotos, deletedPhotos);

      // Limpiar estado de edición
      setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
      setDeletedPhotos([]);
      setIsEditing(false);

      // Recargar fotos
      await reloadPhotos();
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  }, [
    sessionId,
    temporalPhotos,
    deletedPhotos,
    setTemporalPhotos,
    setDeletedPhotos,
    setIsEditing,
    reloadPhotos,
    isSaving,
  ]);

  const handleCancelChanges = useCallback(() => {
    setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
    setDeletedPhotos([]);
    setIsEditing(false);
    resetPhotos();
    toast.info("Cambios cancelados");
  }, [setTemporalPhotos, setDeletedPhotos, setIsEditing, resetPhotos]);

  if (isAuthLoading) {
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
            isLoading={isSaving}
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
};
