export default function FontsPage() {
  return (
    <div className="text-foreground min-h-screen flex flex-col items-center justify-center p-6">
      {/* Texto con Roboto (fuente predeterminada) */}
      <p className="text-lg mb-4">
        Este es un texto con la fuente <strong>Roboto</strong>.
      </p>

      {/* Texto con Playfair Display */}
      <p className="font-playfair text-2xl mb-4">
        Este es un texto con la fuente <strong>Playfair Display</strong>.
      </p>

      {/* Texto con Dancing Script */}
      <p className="font-dancing text-3xl">
        Este es un texto con la fuente <strong>Dancing Script</strong>.
      </p>
    </div>
  );
}
