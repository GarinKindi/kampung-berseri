// src/app/edukasi/page.tsx
import type { Metadata } from "next";
import EducationDetailList from "@/components/sections/EducationDetailList";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Materi Edukasi Pertanian & Peternakan",
  description: "Pusat pembelajaran berbasis data nyata praktik keseharian: pembuatan pupuk organik (POC), silase ternak, dan budidaya TOGA di Kampung Berseri.",
};

export default async function EdukasiPage() {
  const supabase = await createServerSupabase();
  const { data: educationData } = await supabase.from('education').select('*').order('created_at');

  return (
    <div className="animate-in fade-in py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Materi Edukasi</h1>
          <p className="text-stone-600 text-lg max-w-3xl">Pusat pembelajaran berbasis data nyata dari praktik keseharian warga Sulang Kidul.</p>
        </div>
        <EducationDetailList educationData={educationData || []} />
      </div>
    </div>
  );
}