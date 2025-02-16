// app/(main)/page.tsx
"use client";

import { ImageUploader } from "@/components/components/image-uploader";
import { useEditing } from "@/context/EditingContext"; // Importar el contexto
import { pocketbaseClient } from "@/lib/pocketbase";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import Image from "next/image";
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
  const sessionIdFromUrl = pathname.split("/")[1]; // Obtiene el primer segmento después de /

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<PhotosMonthOptions | null>(
    null
  );
  const [photos, setPhotos] = useState<Record<PhotosMonthOptions, string>>(
    {} as Record<PhotosMonthOptions, string>
  );
  const [temporalPhotos, setTemporalPhotos] = useState<
    Record<PhotosMonthOptions, string>
  >({} as Record<PhotosMonthOptions, string>);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Usar el contexto
  const { isEditing } = useEditing();

  // Obtener el sessionId al montar el componente
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const sessionId = sessionIdFromUrl || "0d5tth946j9me9c"; // Usa el ID de la URL o el predeterminado
        setSessionId(sessionId);
      } catch (error) {
        console.error("Error fetching session ID:", error);
      }
    };

    fetchSessionId();
  }, [sessionIdFromUrl]);

  // Cargar fotos al montar el componente o cambiar la sesión
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

  const handleMonthClick = (month: PhotosMonthOptions) => {
    isEditing && setSelectedMonth(month);
  };

  const handleUploadSuccess = (month: PhotosMonthOptions, imageUrl: string) => {
    setTemporalPhotos((prev) => ({ ...prev, [month]: imageUrl }));
    setSelectedMonth(null);
    toast.success(`Imagen de ${month} actualizada`);
  };

  const handleSaveChanges = async () => {
    try {
      if (!sessionId) throw new Error("No hay una sesión activa");

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
      toast.success("Cambios guardados correctamente");
      setTemporalPhotos({} as Record<PhotosMonthOptions, string>);

      // Actualizar fotos
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

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        Album MariRey
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl">
        {months.map((month, index) => {
          const imageUrl = temporalPhotos[month] || photos[month];
          const showDefault = !imageUrl || isLoadingPhotos;

          return (
            <div key={index} className="flex flex-col items-center">
              <h2 className="font-playfair text-lg font-semibold text-center mb-2 sm:mb-4">
                {month}
              </h2>

              <div
                className="w-full aspect-square border rounded-lg overflow-hidden shadow-md relative flex items-center justify-center cursor-pointer"
                onClick={() => handleMonthClick(month)}
              >
                {showDefault ? (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <Image
                      src="/img/pendiente.webp" // Ruta de la imagen por defecto
                      alt="Imagen pendiente"
                      fill // Hace que la imagen ocupe todo el espacio del contenedor
                      className="object-cover rounded-lg" // Asegura que la imagen cubra todo el espacio sin distorsionarse
                    />
                  </div>
                ) : (
                  <Image
                    src={imageUrl}
                    alt={`${month} image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/img/test.webp"; // Imagen de respaldo en caso de error
                    }}
                  />
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white">Cambiar imagen</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isEditing && selectedMonth && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full">
            <ImageUploader
              sessionId={sessionId!}
              month={selectedMonth}
              onSuccess={() => setSelectedMonth(null)}
              onUpload={handleUploadSuccess}
            />
            <button
              onClick={() => setSelectedMonth(null)}
              className="mt-4 text-red-500 hover:text-red-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isEditing && Object.keys(temporalPhotos).length > 0 && (
        <button
          onClick={handleSaveChanges}
          className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Guardar Cambios
        </button>
      )}
    </div>
  );
}
