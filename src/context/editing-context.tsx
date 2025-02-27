"use client";

import { PhotosMonthOptions } from "@/types/pocketbase-types";
import React, { createContext, useContext, useState } from "react";

interface EditingContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  temporalPhotos: Record<PhotosMonthOptions, string>;
  setTemporalPhotos: React.Dispatch<
    React.SetStateAction<Record<PhotosMonthOptions, string>>
  >;
  deletedPhotos: PhotosMonthOptions[];
  setDeletedPhotos: React.Dispatch<React.SetStateAction<PhotosMonthOptions[]>>;
}

const EditingContext = createContext<EditingContextType | undefined>(undefined);

export const EditingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [temporalPhotos, setTemporalPhotos] = useState<
    Record<PhotosMonthOptions, string>
  >({} as Record<PhotosMonthOptions, string>);
  const [deletedPhotos, setDeletedPhotos] = useState<PhotosMonthOptions[]>([]);

  return (
    <EditingContext.Provider
      value={{
        isEditing,
        setIsEditing,
        temporalPhotos,
        setTemporalPhotos,
        deletedPhotos,
        setDeletedPhotos,
      }}
    >
      {children}
    </EditingContext.Provider>
  );
};

export const useEditing = () => {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error("useEditing must be used within an EditingProvider");
  }
  return context;
};
