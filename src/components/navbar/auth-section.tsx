"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LoginForm } from "../login-form";
import { UserDropdown } from "../user-dropdown";
import EditActions from "./edit-actions";

interface AuthSectionProps {
  isAuthenticated: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isEditing: boolean;
  isLoading?: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onStartEditing: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
}

export default function AuthSection({
  isAuthenticated,
  isDialogOpen,
  setIsDialogOpen,
  isEditing,
  isLoading = false,
  onLogout,
  onLogin,
  onStartEditing,
  onSaveChanges,
  onCancelChanges,
}: AuthSectionProps) {
  if (isAuthenticated) {
    return (
      <>
        <UserDropdown onLogout={onLogout} />
        <EditActions
          isEditing={isEditing}
          isLoading={isLoading}
          onStartEditing={onStartEditing}
          onSaveChanges={onSaveChanges}
          onCancelChanges={onCancelChanges}
        />
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Iniciar sesión</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <VisuallyHidden>
          <DialogTitle>Login</DialogTitle>
        </VisuallyHidden>
        <LoginForm onClose={() => setIsDialogOpen(false)} onLogin={onLogin} />
      </DialogContent>
    </Dialog>
  );
}
