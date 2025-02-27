"use client";

import AlbumSessionPage from "@/components/album-session-page";
import MainLayout from "@/components/main-layout";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionPageContent() {
  const { sessionId, sessionName, isLoading, isError } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.push("/not-found");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!sessionId || !sessionName) {
    return null;
  }

  return (
    <MainLayout sessionId={sessionId} sessionName={sessionName}>
      <AlbumSessionPage />
    </MainLayout>
  );
}
