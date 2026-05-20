// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Leaf, Instagram, Youtube, TikTokIcon, MapPin, Phone, ArrowRight } from "@/components/ui/Icons";

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/footer")
      .then((res) => res.json())
      .then((data) => {
        setFooterData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil footer:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <footer className="bg-emerald-950 text-emerald-50 py-16 border-t-[6px] border-amber-600">
        <div className="max-w-7xl mx-auto px-4 text-center">Memuat footer...</div>
      </footer>
    );
  }

  if (!footerData) return null;

  return (
    <footer className="bg-emerald-950 text-emerald-50 py-16 border-t-[6px] border-amber-600 relative">
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none text-[400px] transform translate-x-1/4 -translate-y-1/4 overflow-hidden">
        <Leaf />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-800 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner"><Leaf className="text-amber-400 text-xl" /></div>
              <div>
                <h3 className="font-extrabold text-2xl text-white leading-tight">Kampung Berseri</h3>
                <p className="text-sm text-amber-500 font-semibold uppercase mt-0.5">Sulang Kidul</p>
              </div>
            </div>
            <p className="text-emerald-200/80 mb-8 max-w-md leading-relaxed text-sm md:text-base">{footerData.desc}</p>
            <div className="flex items-center gap-4">
              <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 transition-all"><Instagram className="text-lg" /></a>
              <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 transition-all"><Youtube className="text-lg" /></a>
              <a href={footerData.tiktok} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 transition-all"><TikTokIcon className="text-lg" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 text-lg border-b border-emerald-800/50 pb-3 inline-block">Eksplorasi</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-emerald-200/80 hover:text-amber-400 flex items-center gap-2"><ArrowRight className="text-xs" /> Beranda</Link></li>
              <li><Link href="/paket" className="text-emerald-200/80 hover:text-amber-400 flex items-center gap-2"><ArrowRight className="text-xs" /> Paket & Oleh-oleh</Link></li>
              <li><Link href="/kemitraan" className="text-emerald-200/80 hover:text-amber-400 flex items-center gap-2"><ArrowRight className="text-xs" /> Mitra & Kunjungan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 text-lg border-b border-emerald-800/50 pb-3 inline-block">Hubungi Kami</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3.5 text-emerald-200/90 text-sm">
                <div className="mt-1 bg-emerald-900/60 w-8 h-8 flex items-center justify-center rounded-lg text-amber-400 shrink-0"><MapPin /></div>
                <span className="leading-relaxed">{footerData.address}</span>
              </li>
              <li className="flex items-center gap-3.5 text-emerald-200/90 text-sm">
                <div className="bg-emerald-900/60 w-8 h-8 flex items-center justify-center rounded-lg text-amber-400 shrink-0"><Phone /></div>
                {footerData.phone}
              </li>
            </ul>
          </div>
          <div className="h-48 md:h-full min-h-[200px] w-full rounded-2xl overflow-hidden shadow-inner border border-emerald-800 bg-emerald-900/50 relative">
            {footerData.maps_url ? (
              <iframe src={footerData.maps_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0" title="Lokasi Kampung Berseri"></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600 text-sm font-semibold p-4 text-center">Belum ada peta.</div>
            )}
          </div>
        </div>
        <div className="border-t border-emerald-800 mt-16 pt-8 flex justify-center items-center text-emerald-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Kampung Berseri Sulang Kidul. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}