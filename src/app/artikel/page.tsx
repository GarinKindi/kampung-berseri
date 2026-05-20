// src/app/artikel/page.tsx
import type { Metadata } from "next";
import ArticlesList from "@/components/sections/ArticlesList";
import { createServerSupabase } from "@/lib/supabase/server";
import { Newspaper } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Kabar & Artikel Edukasi",
  description:
    "Dapatkan wawasan terbaru seputar lingkungan, pertanian, dan kegiatan seru di Kampung Berseri untuk menambah wawasan Anda.",
};

export default async function ArtikelPage() {
  const supabase = await createServerSupabase();

  // Ambil artikel yang id-nya tidak NULL dan tidak kosong
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .not("id", "is", null)
    .neq("id", "")
    .order("created_at", { ascending: false });

  // Jika terjadi error, tampilkan halaman dengan array kosong
  const safeArticles = error ? [] : articles || [];

  return (
    <div className="bg-stone-50 min-h-screen py-16 animate-in fade-in relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <Newspaper /> Jendela Informasi
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-4">
            Kabar & Artikel Edukasi
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Dapatkan wawasan terbaru seputar lingkungan, pertanian, dan kegiatan
            seru di Kampung Berseri.
          </p>
        </div>
        <ArticlesList articles={safeArticles} />
      </div>
    </div>
  );
}