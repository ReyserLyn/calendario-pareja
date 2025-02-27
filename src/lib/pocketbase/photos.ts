import type {
  PhotosMonthOptions,
  PhotosResponse,
} from "@/types/pocketbase-types";
import { pocketbaseClient } from "./client";

// Obtener fotos de una sesión
export async function getPhotos(
  sessionId: string,
  timestamp?: string
): Promise<PhotosResponse[]> {
  try {
    const requestKey = timestamp || `photos_${new Date().getTime()}`;
    return await pocketbaseClient.pb
      .collection("photos")
      .getFullList<PhotosResponse>({
        filter: `session = "${sessionId}"`,
        requestKey,
        fields: "*",
      });
  } catch (error) {
    console.error("Error al obtener fotos:", error);
    throw new Error("Error al obtener fotos: " + error);
  }
}

// Subir o actualizar foto de un mes
export async function uploadPhoto(
  sessionId: string,
  month: PhotosMonthOptions,
  image: File
): Promise<PhotosResponse> {
  try {
    const existing = await pocketbaseClient.pb
      .collection("photos")
      .getFirstListItem<PhotosResponse>(
        `month="${month}" && session="${sessionId}"`,
        {
          requestKey: `find_${month}_${new Date().getTime()}`,
        }
      )
      .catch(() => null);

    const formData = new FormData();
    formData.append("month", month);
    formData.append("photo", image);
    formData.append("session", sessionId);

    if (existing) {
      return await pocketbaseClient.pb
        .collection("photos")
        .update<PhotosResponse>(existing.id, formData);
    } else {
      return await pocketbaseClient.pb
        .collection("photos")
        .create<PhotosResponse>(formData);
    }
  } catch (error) {
    console.error("Error al subir foto:", error);
    throw new Error("Error al subir foto: " + error);
  }
}

// Eliminar foto
export async function deletePhoto(
  sessionId: string,
  month: PhotosMonthOptions
): Promise<boolean> {
  try {
    const existing = await pocketbaseClient.pb
      .collection("photos")
      .getFirstListItem<PhotosResponse>(
        `month="${month}" && session="${sessionId}"`,
        {
          requestKey: `delete_${month}_${new Date().getTime()}`,
        }
      );
    await pocketbaseClient.pb.collection("photos").delete(existing.id);
    return true;
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    return false;
  }
}
