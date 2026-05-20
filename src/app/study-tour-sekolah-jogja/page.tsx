import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Study Tour Sekolah di Jogja - Program Edukasi Kampung Berseri",
  description:
    "Paket study tour sekolah terbaik di Jogja dengan materi pertanian organik, TOGA, silase, dan outbound. Dapatkan pengalaman belajar di desa yang menyenangkan.",
};

export default function StudyTourPage() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-stone-800 mb-6">
        Study Tour Sekolah di Jogja
      </h1>
      <p className="text-lg text-stone-600 mb-8">
        Kami menawarkan paket study tour untuk TK, SD, SMP, hingga SMA. Setiap
        kegiatan dirancang sesuai kurikulum merdeka dan memberikan pengalaman
        langsung di alam. Materi meliputi pertanian organik, pengolahan pupuk
        cair, silase, serta outbound seru.
      </p>
      <Link
        href="/paket"
        className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-500 transition"
      >
        Booking Study Tour <ArrowRight />
      </Link>
    </div>
  );
}