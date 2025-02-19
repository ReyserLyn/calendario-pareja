import Navbar from "@/components/navbar/navbar";
import { EditingProvider } from "@/context/editing-context";

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
