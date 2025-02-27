"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaEdit, FaSave, FaSpinner, FaTimes } from "react-icons/fa";

interface EditActionsProps {
  isEditing: boolean;
  isLoading?: boolean;
  onStartEditing: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
}

export default function EditActions({
  isEditing,
  isLoading = false,
  onStartEditing,
  onSaveChanges,
  onCancelChanges,
}: EditActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isEditing ? "default" : "outline"}
        className={cn(
          "flex items-center gap-2",
          isEditing && "bg-green-600 hover:bg-green-700 text-white"
        )}
        size="sm"
        onClick={isEditing ? onSaveChanges : onStartEditing}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <FaSpinner className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Guardando...</span>
          </>
        ) : isEditing ? (
          <>
            <FaSave className="h-5 w-5" />
            <span className="hidden sm:inline">Guardar</span>
          </>
        ) : (
          <>
            <FaEdit className="h-5 w-5" />
            <span className="hidden sm:inline">Editar</span>
          </>
        )}
      </Button>
      {isEditing && (
        <Button
          variant="destructive"
          onClick={onCancelChanges}
          className="gap-2"
          size="sm"
          disabled={isLoading}
        >
          <FaTimes className="h-4 w-4" />
          <span className="hidden sm:inline">Cancelar</span>
        </Button>
      )}
    </div>
  );
}
