import Navbar from "@/components/components/navbar";
import { EditingProvider } from "@/context/EditingContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditingProvider>
      <Navbar />
      {children}
    </EditingProvider>
  );
}
