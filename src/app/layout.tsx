import { ThemeProvider } from "@/components/components/theme-provider";
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
          {children}
          <Toaster position="bottom-right" expand={false} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
