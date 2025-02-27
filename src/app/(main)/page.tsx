import AlbumSessionPage from "@/components/album-session-page";
import MainLayout from "@/components/main-layout";
import { getDefaultSession } from "@/lib/pocketbase/sessions";
import { notFound } from "next/navigation";

export default async function DefaultSessionPage() {
  const session = await getDefaultSession();
  if (!session) {
    notFound();
  }

  return (
    <MainLayout sessionId={session.id} sessionName={session.name}>
      <AlbumSessionPage />
    </MainLayout>
  );
}
