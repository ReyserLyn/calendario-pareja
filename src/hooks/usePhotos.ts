import { getPhotos, pocketbaseClient } from "@/lib/pocketbase";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const usePhotos = (sessionId: string, isEditing: boolean) => {
  const [photos, setPhotos] = useState<Record<PhotosMonthOptions, string>>(
    {} as Record<PhotosMonthOptions, string>
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEditing && sessionId) {
      const loadPhotos = async () => {
        try {
          const records = await getPhotos(sessionId);
          const photosMap = records.reduce(
            (acc, record) => ({
              ...acc,
              [record.month]: pocketbaseClient.pb.files.getUrl(
                record,
                record.photo
              ),
            }),
            {} as Record<PhotosMonthOptions, string>
          );
          setPhotos(photosMap);
        } catch (error) {
          console.error("Error loading photos:", error);
          toast.error("Error al cargar las fotos");
        } finally {
          setIsLoading(false);
        }
      };
      setIsLoading(true);
      loadPhotos();
    }
  }, [isEditing, sessionId]);

  const updatePhoto = (month: PhotosMonthOptions, url: string) => {
    setPhotos((prevPhotos) => ({
      ...prevPhotos,
      [month]: url,
    }));
  };

  return { photos, isLoading, updatePhoto };
};
