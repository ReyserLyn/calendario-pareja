// context/EditingContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type EditingContextType = {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

const EditingContext = createContext<EditingContextType | undefined>(undefined);

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditingContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditingContext.Provider>
  );
}

export function useEditing() {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error("useEditing must be used within an EditingProvider");
  }
  return context;
}
