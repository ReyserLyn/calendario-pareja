import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEditing } from "@/context/editing-context";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import React, { MouseEvent, useCallback } from "react";
import { FaEdit, FaTrash, FaUndoAlt } from "react-icons/fa";
import { ImageWithFallback } from "./image-with-fallback";

interface MonthCardProps {
  month: PhotosMonthOptions;
  imageUrl?: string;
  isLoading: boolean;
  isEditing: boolean;
  onSelect: () => void;
}

export const MonthCard: React.FC<MonthCardProps> = ({
  month,
  imageUrl,
  isLoading,
  isEditing,
  onSelect,
}) => {
  const showDefault = !imageUrl || isLoading;
  const { deletedPhotos, setDeletedPhotos } = useEditing();
  const isMarkedForDeletion = deletedPhotos.includes(month);

  const handleDelete = useCallback(() => {
    setDeletedPhotos((prev) => [...prev, month]);
  }, [month, setDeletedPhotos]);

  const handleRestore = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setDeletedPhotos((prev) => prev.filter((m) => m !== month));
    },
    [month, setDeletedPhotos]
  );

  const handleChangeImage = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-playfair text-lg font-semibold text-center mb-2 sm:mb-4">
        {month}
      </h2>
      <div
        className={`w-full aspect-square border rounded-lg overflow-hidden shadow-md relative flex items-center justify-center ${
          isMarkedForDeletion && isEditing ? "opacity-50" : ""
        }`}
      >
        <ImageWithFallback
          src={isMarkedForDeletion ? undefined : imageUrl}
          fallback="/img/pendiente.webp"
          alt={`${month} image`}
          showDefault={showDefault || isMarkedForDeletion}
        />
        {isEditing && !isMarkedForDeletion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute top-2 right-2 z-10">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará la imagen
                      localmente hasta que guardes los cambios.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="absolute bottom-2 left-2 z-10">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                onClick={handleChangeImage}
              >
                <FaEdit className="h-4 w-4" />
              </button>
            </div>
            <span className="text-white z-10 font-medium">Imagen actual</span>
          </div>
        )}
        {isEditing && isMarkedForDeletion && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <span className="text-white mb-2">Imagen eliminada</span>
            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              <FaUndoAlt size={14} />
              <span>Restaurar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
