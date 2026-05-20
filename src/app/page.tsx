import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import HomeHero from "@/components/sections/HomeHero";
import EducationGrid from "@/components/sections/EducationGrid";
import PartnerStrip from "@/components/sections/PartnerStrip";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Wisata Edukasi Kampung Berseri – Destinasi Ramah Lingkungan",
  description:
    "Belajar langsung tentang pertanian organik, peternakan berkelanjutan, dan budaya pedesaan dari kearifan masyarakat lokal.",
};

export const dynamic = "force-dynamic"; // jangan di-prerender

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
