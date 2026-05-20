import type { Metadata } from "next";
import GalleryGrid from "@/components/sections/GalleryGrid";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Galeri Foto Kegiatan",
  description: "Koleksi potret aktivitas dan momen seru warga serta pengunjung di Kampung Berseri Sulang Kidul.",
};

export default async function GaleriPage() {
  const supabase = await createServerSupabase();
  const { data: images } = await supabase.from('gallery').select('image_url');
  const imageUrls = images?.map((item: any) => item.image_url) || [];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-4">Galeri Foto</h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">Momen seru dan kegiatan edukasi di Kampung Berseri.</p>
      </div>
      <GalleryGrid images={imageUrls} />
    </div>
  );
}