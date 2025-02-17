"use client";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import Image from "next/image";

interface MonthGridProps {
  months: PhotosMonthOptions[];
  photos: Record<PhotosMonthOptions, string>;
  temporalPhotos: Record<PhotosMonthOptions, string>;
  isLoadingPhotos: boolean;
  isEditing: boolean;
  onUploadSuccess: (month: PhotosMonthOptions, imageUrl: string) => void;
}

export default function MonthGrid({
  months,
  photos,
  temporalPhotos,
  isLoadingPhotos,
  isEditing,
  onUploadSuccess,
}: MonthGridProps) {
  return (
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
              onClick={() => {}}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
