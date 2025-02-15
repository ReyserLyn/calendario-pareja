"use client";

import Image from "next/image";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const monttest = true;

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-12 mt-14 md:mt-10">
        Album MariRey
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl">
        {months.map((month, index) => {
          const imagePath = monttest
            ? "/img/test.jpeg"
            : `/img/${month.toLowerCase()}.jpg`;

          return (
            <div key={index} className="flex flex-col items-center">
              <h2 className="font-playfair text-lg font-semibold text-center mb-2 sm:mb-4">
                {month}
              </h2>

              <div className="w-full aspect-square border rounded-lg overflow-hidden shadow-md relative flex items-center justify-center">
                <Image
                  src={imagePath}
                  alt={`${month} image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "";
                    if (target.parentElement) {
                      target.parentElement.textContent = "Pendiente";
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
