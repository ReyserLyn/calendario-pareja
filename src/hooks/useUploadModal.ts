import { useEditing } from "@/context/editing-context";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useUploadModal = () => {
  const [selectedMonth, setSelectedMonth] = useState<PhotosMonthOptions | null>(
    null
  );
  const { setTemporalPhotos } = useEditing();

  const handleUploadSuccess = useCallback(
    (
      month: PhotosMonthOptions,
      imageUrl: string,
      updatePhoto: (month: PhotosMonthOptions, url: string) => void
    ) => {
      setTemporalPhotos((prev) => ({ ...prev, [month]: imageUrl }));
      updatePhoto(month, imageUrl);
      setSelectedMonth(null);
      toast.success(`Imagen de ${month} actualizada`);
    },
    [setTemporalPhotos]
  );

  return { selectedMonth, setSelectedMonth, handleUploadSuccess };
};
