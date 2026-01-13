import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import AnnouncementBanner from "./components/AnnouncementBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RogueClaw — Five Agents. One Token. Zero Humans.",
  description: "Five autonomous AI agents run $ROGUECLAW on Solana. No team. No keys. No multisig. Just the claws.",
  keywords: ["Solana", "AI agents", "autonomous", "DeFi", "ROGUECLAW", "crypto"],
  openGraph: {
    title: "RogueClaw — Five Agents. One Token. Zero Humans.",
    description: "Five autonomous AI agents run $ROGUECLAW on Solana. No team. No keys. No multisig. Just the claws.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "RogueClaw Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RogueClaw — Five Agents. One Token. Zero Humans.",
    description: "Five autonomous AI agents run $ROGUECLAW on Solana. No team. No keys. No multisig.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <AnnouncementBanner />
        <div style={{ paddingTop: 40 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
