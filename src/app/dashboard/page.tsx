// src/app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, SignOut } from "@/components/ui/Icons";
import HeroEditor from "@/components/dashboard/HeroEditor";
import GalleryEditor from "@/components/dashboard/GalleryEditor";
import EducationEditor from "@/components/dashboard/EducationEditor";
import PackageEditor from "@/components/dashboard/PackageEditor";
import OlehEditor from "@/components/dashboard/OlehEditor";
import PartnerEditor from "@/components/dashboard/PartnerEditor";
import ArticleEditor from "@/components/dashboard/ArticleEditor";
import FooterEditor from "@/components/dashboard/FooterEditor";

const sidebarTabs = [
  { key: "beranda", label: "1. Tampilan Beranda" },
  { key: "galeri", label: "2. Galeri Foto" },
  { key: "edukasi", label: "3. Konten Edukasi" },
  { key: "paket", label: "4. Paket Wisata" },
  { key: "oleholeh", label: "5. Oleh-Oleh" },
  { key: "kemitraan", label: "6. Mitra & Kunjungan" },
  { key: "artikel", label: "7. Artikel & SEO" },
  { key: "footer", label: "8. Footer & Kontak" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("beranda");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      if (!user) router.push("/");
      else setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user)
    return (
      <div className="p-10 text-center">Memeriksa autentikasi...</div>
    );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* === SIDEBAR === */}
      <div className="w-full md:w-64 bg-stone-900 text-stone-100 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Building2 className="text-emerald-400" /> Admin Panel
        </h2>
        <div className="space-y-2 flex-grow">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-stone-400 hover:bg-stone-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info tambahan ala dashboard asli */}
        <div className="mt-8 p-4 bg-stone-800 rounded-xl border border-stone-700">
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            <b>Format SEO WebP Aktif:</b> Gambar yang Anda upload otomatis
            di-compress ke standar cepat Google WebP.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-stone-800 text-stone-300 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <SignOut /> Logout
        </button>
      </div>

      {/* === KONTEN EDITOR === */}
      <div className="flex-1 p-6 md:p-10 bg-stone-50 overflow-y-auto">
        {activeTab === "beranda" && <HeroEditor />}
        {activeTab === "galeri" && <GalleryEditor />}
        {activeTab === "edukasi" && <EducationEditor />}
        {activeTab === "paket" && <PackageEditor />}
        {activeTab === "oleholeh" && <OlehEditor />}
        {activeTab === "kemitraan" && <PartnerEditor />}
        {activeTab === "artikel" && <ArticleEditor />}
        {activeTab === "footer" && <FooterEditor />}
      </div>
    </div>
  );
}