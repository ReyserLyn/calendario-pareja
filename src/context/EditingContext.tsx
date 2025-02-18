"use client";

import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { createContext, useContext, useState } from "react";

interface EditingContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  temporalPhotos: Record<PhotosMonthOptions, string>;
  setTemporalPhotos: (photos: Record<PhotosMonthOptions, string>) => void;
}

const EditingContext = createContext<EditingContextType>(
  {} as EditingContextType
);

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [temporalPhotos, setTemporalPhotos] = useState<
    Record<PhotosMonthOptions, string>
  >({} as Record<PhotosMonthOptions, string>);

  return (
    <EditingContext.Provider
      value={{ isEditing, setIsEditing, temporalPhotos, setTemporalPhotos }}
    >
      {children}
    </EditingContext.Provider>
  );
}

export const useEditing = () => useContext(EditingContext);
