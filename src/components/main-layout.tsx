"use client";

import { PhotosProvider } from "@/context/photos-context";
import { useSession } from "@/hooks/useSessions";
import { LoadingSpinner } from "./loading-spinner";
import { Navbar } from "./navbar/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionId, sessionName, isLoading, isError } = useSession();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError)
    return <div className="p-4 text-center">Sesión no encontrada</div>;

  return (
    <PhotosProvider sessionId={sessionId!} sessionName={sessionName!}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </PhotosProvider>
  );
}
