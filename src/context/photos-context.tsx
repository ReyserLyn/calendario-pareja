"use client";

import { getPhotos, pocketbaseClient } from "@/lib/pocketbase";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useEditing } from "./editing-context";

interface PhotosContextType {
  photos: Record<PhotosMonthOptions, string>;
  isLoading: boolean;
  updatePhoto: (month: PhotosMonthOptions, url: string) => void;
  reloadPhotos: () => Promise<void>;
  resetPhotos: () => void;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

export const PhotosProvider: React.FC<{
  children: React.ReactNode;
  sessionId: string;
}> = ({ children, sessionId }) => {
  const [photos, setPhotos] = useState<Record<PhotosMonthOptions, string>>(
    {} as Record<PhotosMonthOptions, string>
  );
  const [originalPhotos, setOriginalPhotos] = useState<
    Record<PhotosMonthOptions, string>
  >({} as Record<PhotosMonthOptions, string>);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { temporalPhotos, deletedPhotos } = useEditing();

  const loadPhotos = useCallback(async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const records = await getPhotos(sessionId, new Date().toISOString());
      const photosMap = records.reduce((acc, record) => {
        const url = `${pocketbaseClient.pb.files.getURL(
          record,
          record.photo
        )}?t=${new Date().getTime()}`;
        return { ...acc, [record.month]: url };
      }, {} as Record<PhotosMonthOptions, string>);
      setPhotos(photosMap);
      setOriginalPhotos(photosMap);
    } catch (error) {
      console.error("Error loading photos:", error);
      toast.error("Error al cargar las fotos");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      loadPhotos();
    }
  }, [sessionId, loadPhotos]);

  // Actualiza las fotos en función de las modificaciones temporales y eliminaciones en el modo de edición
  useEffect(() => {
    if (Object.keys(originalPhotos).length === 0) return;
    const updatedPhotos = { ...originalPhotos };
    Object.entries(temporalPhotos).forEach(([month, url]) => {
      updatedPhotos[month as PhotosMonthOptions] = url;
    });
    deletedPhotos.forEach((month) => {
      delete updatedPhotos[month];
    });
    setPhotos(updatedPhotos);
  }, [temporalPhotos, deletedPhotos, originalPhotos]);

  const updatePhoto = useCallback((month: PhotosMonthOptions, url: string) => {
    setPhotos((prev) => ({ ...prev, [month]: url }));
  }, []);

  const resetPhotos = useCallback(() => {
    setPhotos(originalPhotos);
  }, [originalPhotos]);

  const reloadPhotos = useCallback(async () => {
    await loadPhotos();
  }, [loadPhotos]);

  return (
    <PhotosContext.Provider
      value={{ photos, isLoading, updatePhoto, reloadPhotos, resetPhotos }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotosContext = () => {
  const context = useContext(PhotosContext);
  if (!context) {
    throw new Error("usePhotosContext must be used within a PhotosProvider");
  }
  return context;
};
