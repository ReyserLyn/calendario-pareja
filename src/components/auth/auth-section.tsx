"use client";

import EditActions from "../navbar/edit-actions";
import { UserDropdown } from "../user-dropdown";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

interface AuthSectionProps {
  isAuthenticated: boolean;
  isEditing: boolean;
  isLoading?: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onStartEditing: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
}

export default function AuthSection({
  isAuthenticated,
  isEditing,
  isLoading = false,
  onLogin,
  onRegister,
  onLogout,
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
    <div className="flex items-center gap-2">
      <LoginModal onLogin={onLogin} />
      <RegisterModal onRegister={onRegister} />
    </div>
  );
}
