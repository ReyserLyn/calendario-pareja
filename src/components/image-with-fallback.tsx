import Image from "next/image";

export const ImageWithFallback = ({
  src,
  fallback,
  alt,
  showDefault,
}: {
  src?: string;
  fallback: string;
  alt: string;
  showDefault: boolean;
}) => {
  if (showDefault) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <Image
          src={fallback}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <Image
      src={src || fallback}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover rounded-lg"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallback;
      }}
    />
  );
};
