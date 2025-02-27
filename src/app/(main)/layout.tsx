"use client";

import { Navbar } from "@/components/navbar/navbar";
import { EditingProvider } from "@/context/editing-context";
import { PhotosProvider } from "@/context/photos-context";
import { useSession } from "@/hooks/useSessions";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = useSession();

  if (!sessionId) return <div>Cargando sesión...</div>;

  return (
    <EditingProvider>
      <PhotosProvider sessionId={sessionId}>
        <Navbar />
        {children}
      </PhotosProvider>
    </EditingProvider>
  );
}
