"use client";
import { ImageUploader } from "@/components/image-uploader";
import { MonthGrid } from "@/components/month-grid";
import { useEditing } from "@/context/EditingContext";
import { usePhotos } from "@/hooks/usePhotos";
import { useUploadModal } from "@/hooks/useUploadModal";
import { getSessionIdFromPathname } from "@/lib/seesions";
import { usePathname } from "next/navigation";

export default function Home() {
  const sessionId = getSessionIdFromPathname(usePathname());
  const { isEditing } = useEditing();
  const {
    photos,
    isLoading: isLoadingPhotos,
    updatePhoto,
  } = usePhotos(sessionId, isEditing);
  const { selectedMonth, handleUploadSuccess, setSelectedMonth } =
    useUploadModal();

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        Album MariRey
      </h1>

      <MonthGrid
        photos={photos}
        isLoading={isLoadingPhotos}
        onMonthSelect={setSelectedMonth}
        isEditing={isEditing}
      />

      {isEditing && selectedMonth && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full">
            <ImageUploader
              sessionId={sessionId}
              month={selectedMonth}
              onSuccess={(url) =>
                handleUploadSuccess(selectedMonth, url, updatePhoto)
              }
              isOpen={!!selectedMonth}
              setIsOpen={() => setSelectedMonth(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
