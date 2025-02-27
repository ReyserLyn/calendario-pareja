import { ThemeProvider } from "@/components/theme-provider";
import { EditingProvider } from "@/context/editing-context";
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
  description: "Álbum calendario para fotos en pareja",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${playfairDisplay.variable} ${dancingScript.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EditingProvider>
            {children}
            <Toaster position="bottom-right" expand={false} richColors />
          </EditingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
