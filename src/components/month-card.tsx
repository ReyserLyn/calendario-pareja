import { ImageWithFallback } from "./image-with-fallback";

export const MonthCard = ({
  month,
  imageUrl,
  isLoading,
  isEditing,
  onSelect,
}: {
  month: string;
  imageUrl?: string;
  isLoading: boolean;
  isEditing: boolean;
  onSelect: () => void;
}) => {
  const showDefault = !imageUrl || isLoading;

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-playfair text-lg font-semibold text-center mb-2 sm:mb-4">
        {month}
      </h2>

      <button
        className="w-full aspect-square border rounded-lg overflow-hidden shadow-md relative flex items-center justify-center"
        onClick={onSelect}
        disabled={!isEditing}
      >
        <ImageWithFallback
          src={imageUrl}
          fallback="/img/pendiente.webp"
          alt={`${month} image`}
          showDefault={showDefault}
        />

        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white">Cambiar imagen</span>
          </div>
        )}
      </button>
    </div>
  );
};
