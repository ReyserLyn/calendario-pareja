import { deletePhoto, uploadPhoto } from "@/lib/pocketbase";
import type { PhotosMonthOptions } from "@/types/pocketbase-types";

export async function uploadPhotos(
  sessionId: string,
  temporalPhotos: Record<PhotosMonthOptions, string>,
  deletedPhotos: PhotosMonthOptions[]
): Promise<boolean> {
  try {
    const updatePromises = Object.entries(temporalPhotos).map(
      async ([month, imageUrl]) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${month}.webp`, { type: blob.type });
        return uploadPhoto(sessionId, month as PhotosMonthOptions, file);
      }
    );

    const deletionPromises = deletedPhotos.map(async (month) =>
      deletePhoto(sessionId, month)
    );

    await Promise.all([...updatePromises, ...deletionPromises]);
    return true;
  } catch (error) {
    console.error("Error en uploadPhotos:", error);
    throw error;
  }
}
