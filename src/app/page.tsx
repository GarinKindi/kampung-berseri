// src/app/page.tsx
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import HomeHero from "@/components/sections/HomeHero";
import EducationGrid from "@/components/sections/EducationGrid";
import PartnerStrip from "@/components/sections/PartnerStrip";
import JsonLd from "@/components/ui/JsonLd";

// ========== OPTIMASI METADATA UNTUK SEO & MEDIA SOSIAL ==========
export const metadata: Metadata = {
  metadataBase: new URL("https://kampung-berseri.vercel.app"),
  title: {
    default: "Kampung Berseri - Wisata Edukasi & Green Tourism Jogja",
    template: "%s | Kampung Berseri",
  },
  description:
    "Wisata edukasi modern di Jogja dengan program pertanian organik, TOGA, silase ternak, UMKM desa, study tour sekolah, dan Green Education Tourism.",
  keywords: [
    "wisata edukasi jogja",
    "green tourism jogja",
    "study tour sekolah jogja",
    "pertanian organik jogja",
    "kampung berseri",
    "agrowisata bantul",
    "wisata edukasi anak jogja",
    "desa wisata jogja",
  ],
  authors: [{ name: "Kampung Berseri" }],
  creator: "Kampung Berseri",
  category: "Tourism",
  
  // OPEN GRAPH (Facebook, WhatsApp, Telegram, LinkedIn)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kampung-berseri.vercel.app",
    siteName: "Kampung Berseri",
    title: "Kampung Berseri - Wisata Edukasi & Green Tourism Jogja",
    description:
      "Belajar pertanian organik, peternakan berkelanjutan, dan budaya pedesaan. Kunjungi Kampung Berseri untuk pengalaman wisata edukasi yang tak terlupakan!",
    images: [
      {
        url: "/og-image.jpg", // GANTI dengan nama file gambar Anda
        width: 1200,
        height: 630,
        alt: "Kampung Berseri - Wisata Edukasi Jogja",
      },
    ],
  },
  
  // TWITTER CARD (X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Kampung Berseri - Wisata Edukasi Jogja",
    description: "Belajar pertanian organik, peternakan berkelanjutan, dan budaya pedesaan.",
    images: ["/og-image.jpg"], // GANTI dengan nama file gambar Anda
  },
  
  // ROBOTS (SEO)
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
  
  // CANONICAL URL
  alternates: {
    canonical: "https://kampung-berseri.vercel.app",
  },
};
// ========== END OPTIMASI METADATA ==========

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const { data: heroRow } = await supabase
    .from("hero")
    .select("*")
    .limit(1)
    .single();

  const { data: educationRows } = await supabase
    .from("education")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: partnerRows } = await supabase
    .from("partners")
    .select("*");

  // Fallback data jika heroRow kosong
  const heroData = heroRow
    ? {
        badge: heroRow.badge,
        titleMain: heroRow.title_main,
        titleHighlight: heroRow.title_highlight,
        desc: heroRow.desc,
        bgImage: heroRow.bg_image,
      }
    : {
        badge: "Destinasi Wisata Ramah Lingkungan",
        titleMain: "Wisata Edukasi",
        titleHighlight: "Kampung Berseri",
        desc: "Belajar langsung tentang pertanian organik, peternakan berkelanjutan, dan budaya pedesaan dari kearifan masyarakat lokal.",
        bgImage:
          "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000",
      };

  const educationData = (educationRows || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    desc: item.desc,
    details: item.details || [],
    image: item.image,
  }));

  const partnersData = (partnerRows || []).map((p: any) => ({
    name: p.name,
    type: p.type,
    logo: p.logo,
    badge: p.badge,
  }));

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Kampung Berseri Sulang Kidul",
    description: heroData.desc,
    image: heroData.bgImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bantul",
      addressRegion: "DIY",
      addressCountry: "ID",
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <div className="animate-in fade-in duration-500">
        <HomeHero heroData={heroData} />
        <EducationGrid educationData={educationData} />
        <PartnerStrip partnersData={partnersData} />
      </div>
    </>
  );
}
