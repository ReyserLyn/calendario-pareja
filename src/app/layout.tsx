import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Dancing_Script, Playfair_Display, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./styles/globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Calendario Pareja",
  description: "Album calendario para fotos en pareja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${playfairDisplay.variable} ${dancingScript.variable} antialiased flex flex-col max-h-screen w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="absolute inset-0 -z-10 h-full w-full transition-colors duration-300"
            style={{
              backgroundImage:
                "radial-gradient(var(--background-dot-color) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          ></div>
          {children}
          <Toaster position="bottom-right" expand={false} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
