import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Wisata Edukasi Jogja Terbaik - Kampung Berseri",
  description:
    "Tempat wisata edukasi di Jogja yang menawarkan pengalaman pertanian organik, peternakan, TOGA, dan UMKM desa. Cocok untuk study tour sekolah dan keluarga.",
  keywords: [
    "wisata edukasi jogja",
    "wisata edukasi anak jogja",
    "tempat study tour di jogja",
    "wisata pertanian jogja",
  ],
  openGraph: {
    title: "Wisata Edukasi Jogja Terbaik - Kampung Berseri",
    description: "Belajar pertanian organik, TOGA, silase, dan budaya desa di Jogja.",
  },
};

export default function WisataEdukasiJogjaPage() {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-stone-800 mb-6">
        Wisata Edukasi Jogja – Kampung Berseri
      </h1>
      <p className="text-lg text-stone-600 mb-8">
        Kampung Berseri Sulang Kidul adalah destinasi{" "}
        <strong>green education tourism</strong> unggulan di Jogja. Kami
        menyediakan paket wisata edukasi untuk sekolah, keluarga, dan
        mahasiswa dengan fokus pada pertanian organik, pembuatan pupuk,
        silase ternak, TOGA, dan pemberdayaan UMKM lokal.
      </p>
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">
        Kenapa Pilih Kami?
      </h2>
      <ul className="list-disc list-inside space-y-2 text-stone-600 mb-8">
        <li>Pengalaman langsung di sawah dan kandang</li>
        <li>Pemandu lokal yang ramah</li>
        <li>Paket study tour lengkap dengan modul edukasi</li>
        <li>Lokasi strategis di Bantul, dekat Kota Jogja</li>
      </ul>
      <Link
        href="/paket"
        className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-500 transition"
      >
        Lihat Paket Wisata <ArrowRight />
      </Link>
    </div>
  );
}