import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/contexts/providers";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mayalu — Romantic Graph Dating & Matrimony",
  description: "Mayalu is a dual-mode dating and matrimonial platform powered by Neo4j graph affinities, verified Chino credentials, and privacy Dhukuti.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mayalu",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#171023" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers
        >
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
