"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pocketbaseClient } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserDropdown({
  onLogout, // Nueva prop para manejar el logout
}: {
  onLogout: () => void;
}) {
  const router = useRouter();
  const user = pocketbaseClient.getCurrentUser();

  const handleLogout = () => {
    pocketbaseClient.logout();
    toast.success("Sesión cerrada correctamente.");
    onLogout(); // Actualizar el estado de autenticación en el componente padre
    router.push("/"); // Redirigir a la página principal
  };

  if (!user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex gap-2">
          <span className="font-medium">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
