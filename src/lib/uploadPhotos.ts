import { pocketbaseClient } from "@/lib/pocketbase";
import { PhotosMonthOptions } from "@/types/pocketbase-types";

export async function uploadPhotos(
  sessionId: string,
  temporalPhotos: Record<PhotosMonthOptions, string>
) {
  const updates = Object.entries(temporalPhotos).map(
    async ([month, imageUrl]) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${month}.webp`, { type: blob.type });
        await pocketbaseClient.uploadPhoto(
          sessionId,
          month as PhotosMonthOptions,
          file
        );
      } catch (error) {
        console.error(`Error al actualizar ${month}:`, error);
        throw error;
      }
    }
  );
  await Promise.all(updates);
}
