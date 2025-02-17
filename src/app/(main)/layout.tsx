import Navbar from "@/components/navbar";
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
