import { useEditing } from "@/context/EditingContext";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { useState } from "react";
import { toast } from "sonner";

export const useUploadModal = () => {
  const [selectedMonth, setSelectedMonth] = useState<PhotosMonthOptions | null>(
    null
  );
  const { temporalPhotos, setTemporalPhotos } = useEditing();

  const handleUploadSuccess = (
    month: PhotosMonthOptions,
    imageUrl: string,
    updatePhoto: (month: PhotosMonthOptions, url: string) => void
  ) => {
    // Actualizar estado temporal
    setTemporalPhotos({ ...temporalPhotos, [month]: imageUrl });

    // Actualizar estado principal de photos
    updatePhoto(month, imageUrl);

    setSelectedMonth(null);
    toast.success(`Imagen de ${month} actualizada`);
  };

  return { selectedMonth, setSelectedMonth, handleUploadSuccess };
};
