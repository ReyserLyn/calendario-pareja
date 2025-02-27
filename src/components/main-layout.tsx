"use client";

import { Navbar } from "@/components/navbar/navbar";
import { PhotosProvider } from "@/context/photos-context";

interface MainLayoutProps {
  children: React.ReactNode;
  sessionId: string;
  sessionName: string;
}

export default function MainLayout({
  children,
  sessionId,
  sessionName,
}: MainLayoutProps) {
  return (
    <PhotosProvider sessionId={sessionId} sessionName={sessionName}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </PhotosProvider>
  );
}
