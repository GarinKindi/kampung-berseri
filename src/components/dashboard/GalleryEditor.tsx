"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash, Upload } from "@/components/ui/Icons";
import { processImageToWebP } from "@/lib/utils";

export default function GalleryEditor() {
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*');
    setImages(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webpBase64 = await processImageToWebP(file);
      // ✅ Gunakan API route (bukan langsung supabase)
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: webpBase64 }),
      });
      fetchImages();
    } catch (error) {
      console.error(error);
      alert('Gagal mengupload gambar. Periksa koneksi atau coba lagi.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus foto ini secara permanen dari website?')) return;
    // ✅ Gunakan API route
    await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchImages();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-stone-800">Manajemen Galeri</h3>
          <p className="text-sm text-stone-500">Tambah foto ke halaman Galeri website Anda.</p>
        </div>
        <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2">
          {isUploading ? (
            <><span className="animate-spin">⏳</span> Proses Kompres...</>
          ) : (
            <><Upload /> Upload Foto</>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm">
            <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button onClick={() => handleDelete(img.id)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}