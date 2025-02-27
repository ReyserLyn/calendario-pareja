import AlbumSessionPage from "@/components/album-session-page";
import MainLayout from "@/components/main-layout";
import { getSession } from "@/lib/pocketbase/sessions";
import { notFound } from "next/navigation";

export default async function DefaultSessionPage() {
  const sessionId = process.env.NEXT_PUBLIC_DEFAULT_SESSION_ID;

  const session = await getSession(sessionId);
  if (!session) notFound();

  return (
    <MainLayout sessionId={session.id} sessionName={session.name}>
      <AlbumSessionPage />
    </MainLayout>
  );
}
