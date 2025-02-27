import { months } from "@/constants/months";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import React from "react";
import { MonthCard } from "./month-card";

interface MonthGridProps {
  photos: Record<PhotosMonthOptions, string>;
  isLoading: boolean;
  onMonthSelect: (month: PhotosMonthOptions) => void;
  isEditing: boolean;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  photos,
  isLoading,
  onMonthSelect,
  isEditing,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl">
      {months.map((month) => (
        <MonthCard
          key={month}
          month={month}
          imageUrl={photos[month]}
          isLoading={isLoading}
          isEditing={isEditing}
          onSelect={() => onMonthSelect(month)}
        />
      ))}
    </div>
  );
};
