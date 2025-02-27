"use client";

import { MonthGrid } from "@/components/month-grid";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useEditing } from "@/context/editing-context";
import { usePhotosContext } from "@/context/photos-context";
import { useUploadModal } from "@/hooks/useUploadModal";

export default function HomePage() {
  const { isEditing } = useEditing();
  const { photos, isLoading, updatePhoto } = usePhotosContext();
  const { selectedMonth, handleUploadSuccess, setSelectedMonth } =
    useUploadModal();

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        Album MariRey
      </h1>
      <MonthGrid
        photos={photos}
        isLoading={isLoading}
        onMonthSelect={setSelectedMonth}
        isEditing={isEditing}
      />
      {isEditing && selectedMonth && (
        <ResponsiveDialog
          onSuccess={(url) =>
            handleUploadSuccess(selectedMonth, url, updatePhoto)
          }
          isOpen={!!selectedMonth}
          setIsOpen={() => setSelectedMonth(null)}
        />
      )}
    </div>
  );
}
