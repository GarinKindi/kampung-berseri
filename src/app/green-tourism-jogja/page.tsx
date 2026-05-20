import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Green Tourism Jogja – Wisata Ramah Lingkungan di Kampung Berseri",
  description:
    "Rasakan green tourism di Jogja yang mengedepankan kelestarian lingkungan, pertanian organik, dan edukasi alam. Cocok untuk wisata keluarga dan sekolah.",
};

export default function GreenTourismPage() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-stone-800 mb-6">
        Green Tourism Jogja
      </h1>
      <p className="text-lg text-stone-600 mb-8">
        Kampung Berseri adalah perintis <strong>green tourism</strong> di
        Yogyakarta. Kami mengajak Anda untuk menikmati keindahan desa sambil
        belajar cara bertani organik, mengolah limbah, dan melestarikan
        lingkungan. Semua aktivitas kami ramah lingkungan dan mendukung
        ekonomi warga setempat.
      </p>
      <Link
        href="/paket"
        className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-500 transition"
      >
        Jelajahi Paket <ArrowRight />
      </Link>
    </div>
  );
}