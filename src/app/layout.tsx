import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLD from "@/components/seo/JsonLD";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kampungberseri.id"),
  title: {
    default:
      "Kampung Berseri Sulang Kidul - Wisata Edukasi & Green Tourism Terbaik di Jogja",
    template: "%s | Kampung Berseri",
  },
  description:
    "Wisata edukasi terbaik di Jogja dan Klaten dengan program pertanian organik, TOGA, silase ternak, UMKM desa, study tour sekolah, dan Green Education Tourism modern.",
  keywords: [
    "wisata edukasi jogja",
    "wisata edukasi klaten",
    "green tourism jogja",
    "study tour sekolah jogja",
    "wisata edukasi pertanian",
    "desa wisata jogja",
    "agrowisata jawa tengah",
    "wisata edukasi anak",
    "wisata sekolah jogja",
    "kampung berseri",
  ],
  authors: [{ name: "Kampung Berseri" }],
  creator: "Kampung Berseri",
  category: "Tourism",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kampungberseri.id",
    siteName: "Kampung Berseri",
    title: "Kampung Berseri - Green Education Tourism Jogja",
    description:
      "Nikmati wisata edukasi modern di Jogja dengan pengalaman pertanian organik, peternakan, TOGA, UMKM desa, dan study tour sekolah terbaik.",
    images: [
      {
        url: "/og-jogja-tourism.jpg",
        width: 1200,
        height: 630,
        alt: "Wisata Edukasi Kampung Berseri Jogja",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisata Edukasi Jogja - Kampung Berseri",
    description:
      "Green Education Tourism modern untuk keluarga dan sekolah.",
    images: ["/og-jogja-tourism.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kampungberseri.id",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="min-h-screen bg-stone-50 text-stone-800 font-sans flex flex-col overflow-x-hidden">
        <JsonLD />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}