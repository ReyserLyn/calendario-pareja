import AlbumSessionPage from "@/components/album-session-page";
import MainLayout from "@/components/main-layout";
import { getSession } from "@/lib/pocketbase";
import { notFound } from "next/navigation";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const sessionId = (await params).sessionId;

  const session = await getSession(sessionId);
  if (!session) notFound();

  return (
    <MainLayout sessionId={session.id} sessionName={session.name}>
      <AlbumSessionPage />
    </MainLayout>
  );
}
