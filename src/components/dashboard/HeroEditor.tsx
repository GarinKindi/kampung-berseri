"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { processImageToWebP } from "@/lib/utils";

export default function HeroEditor() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    const { data } = await supabase.from('hero').select('*').single();
    setHeroData(data);
  };

  const handleSave = async () => {
  setLoading(true);
  await fetch('/api/hero', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(heroData),
  });
  setLoading(false);
  alert('Hero beranda berhasil disimpan!');
};

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webpBase64 = await processImageToWebP(file);
      setHeroData({ ...heroData, bg_image: webpBase64 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  if (!heroData) return <p>Memuat data hero...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <h3 className="text-2xl font-bold text-stone-800 mb-4">Pengaturan Tampilan Beranda</h3>
      <p className="text-sm text-stone-500 mb-6">Ubah teks sambutan dan foto latar belakang (Hero) di halaman depan.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Teks Badge (Label Kecil di Atas Judul)</label>
          <input value={heroData.badge} onChange={e => setHeroData({...heroData, badge: e.target.value})} className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Judul Utama (Teks Putih)</label>
            <input value={heroData.title_main} onChange={e => setHeroData({...heroData, title_main: e.target.value})} className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Judul Highlight (Teks Warna Emas)</label>
            <input value={heroData.title_highlight} onChange={e => setHeroData({...heroData, title_highlight: e.target.value})} className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
          <textarea rows={3} value={heroData.desc} onChange={e => setHeroData({...heroData, desc: e.target.value})} className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
        </div>

        {/* Upload Background */}
        <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 border-dashed mt-6">
          <label className="block text-sm font-bold text-stone-700 mb-3">Foto Latar Belakang (Otomatis dikonversi ke WebP)</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {heroData.bg_image && (
              <img src={heroData.bg_image} className="w-40 h-24 object-cover rounded-xl border border-stone-300 shadow-sm" alt="Preview" />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer transition-colors"
              />
              {isUploading && (
                <p className="text-sm text-emerald-600 font-bold mt-3">
                  <span className="inline-block animate-spin mr-2">⏳</span> Sedang mengompres gambar...
                </p>
              )}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 transition-all">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}