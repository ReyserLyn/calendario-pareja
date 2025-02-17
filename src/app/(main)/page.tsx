// app/page.tsx
"use client";
import { ImageUploader } from "@/components/image-uploader";
import { useEditing } from "@/context/EditingContext";
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
  const sessionId = pathname.split("/")[1] || "0d5tth946j9me9c";
  const [selectedMonth, setSelectedMonth] = useState<PhotosMonthOptions | null>(
    null
  );
  const [photos, setPhotos] = useState<Record<PhotosMonthOptions, string>>(
    {} as Record<PhotosMonthOptions, string>
  );
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const { isEditing, temporalPhotos, setTemporalPhotos } = useEditing();

  useEffect(() => {
    if (!isEditing && sessionId) {
      const refreshPhotos = async (): Promise<void> => {
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

      refreshPhotos();
    }
  }, [isEditing, sessionId]);

  const handleUploadSuccess = (month: PhotosMonthOptions, imageUrl: string) => {
    setTemporalPhotos({ ...temporalPhotos, [month]: imageUrl });
    setSelectedMonth(null);
    toast.success(`Imagen de ${month} actualizada`);
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

              <button
                className="w-full aspect-square border rounded-lg overflow-hidden shadow-md relative flex items-center justify-center"
                onClick={() => isEditing && setSelectedMonth(month)}
                disabled={!isEditing}
              >
                {showDefault ? (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <Image
                      src="/img/pendiente.webp"
                      alt="Imagen pendiente"
                      fill
                      className="object-cover rounded-lg"
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
                      target.src = "/img/pendiente.webp";
                    }}
                  />
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white">Cambiar imagen</span>
                  </div>
                )}
              </button>
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
              onSuccess={(url) => handleUploadSuccess(selectedMonth, url)}
              isOpen={!!selectedMonth}
              setIsOpen={() => setSelectedMonth(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
