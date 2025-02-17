import { months } from "@/constants/months";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { MonthCard } from "./month-card";

export const MonthGrid = ({
  photos,
  isLoading,
  onMonthSelect,
  isEditing,
}: {
  photos: Record<PhotosMonthOptions, string>;
  isLoading: boolean;
  onMonthSelect: (month: PhotosMonthOptions) => void;
  isEditing: boolean;
}) => (
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
