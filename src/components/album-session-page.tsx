"use client";

import { MonthGrid } from "@/components/month-grid";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useEditing } from "@/context/editing-context";
import { usePhotosContext } from "@/context/photos-context";
import { useUploadModal } from "@/hooks/useUploadModal";

export default function AlbumSessionPage() {
  const { isEditing } = useEditing();
  const { photos, updatePhoto, isLoading, error, sessionName } =
    usePhotosContext();
  const { selectedMonth, handleUploadSuccess, setSelectedMonth } =
    useUploadModal();

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        {sessionName}
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
