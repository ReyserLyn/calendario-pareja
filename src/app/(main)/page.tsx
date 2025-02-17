"use client";
import EditControls from "@/components/edit-controls";
import MonthGrid from "@/components/month-grid";
import { useEditing } from "@/context/EditingContext";
import { pocketbaseClient } from "@/lib/pocketbase";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const months: PhotosMonthOptions[] = [
  PhotosMonthOptions.Enero,
  PhotosMonthOptions.Febrero,
  PhotosMonthOptions.Marzo,
  PhotosMonthOptions.Abril,
  PhotosMonthOptions.Mayo,
  PhotosMonthOptions.Junio,
  PhotosMonthOptions.Julio,
  PhotosMonthOptions.Agosto,
  PhotosMonthOptions.Setiembre,
  PhotosMonthOptions.Octubre,
  PhotosMonthOptions.Noviembre,
  PhotosMonthOptions.Diciembre,
];

export default function Home() {
  const pathname = usePathname();
  const sessionIdFromUrl = pathname.split("/")[1];
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<PhotosMonthOptions, string>>(
    {} as Record<PhotosMonthOptions, string>
  );
  const [temporalPhotos, setTemporalPhotos] = useState<
    Record<PhotosMonthOptions, string>
  >({} as Record<PhotosMonthOptions, string>);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const { isEditing, setIsEditing } = useEditing();

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const sessionId = sessionIdFromUrl || "0d5tth946j9me9c";
        setSessionId(sessionId);
      } catch (error) {
        console.error("Error fetching session ID:", error);
      }
    };
    fetchSessionId();
  }, [sessionIdFromUrl]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!sessionId) return;
      setIsLoadingPhotos(true);
      try {
        const records = await pocketbaseClient.getPhotos(sessionId);
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
        setIsLoadingPhotos(false);
      }
    };
    fetchPhotos();
  }, [sessionId]);

  const handleSaveChanges = async () => {
    try {
      if (!sessionId) throw new Error("No hay una sesión activa");
      const updates = Object.entries(temporalPhotos).map(
        async ([month, imageUrl]) => {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${month}.webp`, { type: blob.type });
          await pocketbaseClient.uploadPhoto(
            sessionId,
            month as PhotosMonthOptions,
            file
          );
        }
      );
      await Promise.all(updates);
      toast.success("Cambios guardados correctamente");
      setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
      const updatedRecords = await pocketbaseClient.getPhotos(sessionId);
      setPhotos(
        updatedRecords.reduce(
          (acc, record) => ({
            ...acc,
            [record.month]: pocketbaseClient.pb.files.getUrl(
              record,
              record.photo
            ),
          }),
          {} as Record<PhotosMonthOptions, string>
        )
      );
    } catch (error) {
      toast.error("Error al guardar los cambios");
      console.error("Save error:", error);
    }
  };

  const handleCancelChanges = () => {
    setTemporalPhotos({} as Record<PhotosMonthOptions, string>);
    setIsEditing(false);
    toast.info("Cambios cancelados");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        Album MariRey
      </h1>
      <MonthGrid
        months={months}
        photos={photos}
        temporalPhotos={temporalPhotos}
        isLoadingPhotos={isLoadingPhotos}
        isEditing={isEditing}
        onUploadSuccess={(month, imageUrl) =>
          setTemporalPhotos((prev) => ({ ...prev, [month]: imageUrl }))
        }
      />
      {isEditing && Object.keys(temporalPhotos).length > 0 && (
        <EditControls
          onSave={handleSaveChanges}
          onCancel={handleCancelChanges}
        />
      )}
    </div>
  );
}
