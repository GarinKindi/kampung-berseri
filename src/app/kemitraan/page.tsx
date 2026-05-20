import type { Metadata } from "next";
import PartnersList from "@/components/sections/PartnersList";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mitra & Kunjungan",
  description: "Ratusan instansi, universitas, sekolah, dan perusahaan telah mempercayakan agenda wisata edukasinya kepada Kampung Berseri.",
};

export default async function KemitraanPage() {
  const supabase = await createServerSupabase();
  const { data: partners } = await supabase.from('partners').select('*');

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-4">Mitra & Kunjungan</h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">Lembaga dan perusahaan yang telah mempercayakan kunjungan edukasi kepada kami.</p>
      </div>
      <PartnersList partners={partners || []} />
    </div>
  );
}