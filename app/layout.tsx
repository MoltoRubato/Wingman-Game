import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { PaintFilters } from "@/components/svg/PaintFilters";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-google",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ui-google",
});

export const metadata: Metadata = {
  title: "Rival Hearts: The Confidant",
  description:
    "A two-player cooperative game of love, rivalry, and indirect communication. Court Silence is in force.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <PaintFilters />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
