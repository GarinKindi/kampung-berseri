"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { processImageToWebP } from "@/lib/utils";
import {
  Plus,
  EditIcon,
  Trash,
  X,
  CheckCircle2,
  Upload,
} from "@/components/ui/Icons";
import { OlehOlehItem } from "@/types";

export default function OlehEditor() {
  const [items, setItems] = useState<OlehOlehItem[]>([]);
  const [edit, setEdit] = useState<OlehOlehItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Ambil data dari Supabase
  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("oleh_oleh").select("*");
    setItems(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mulai form baru
  const startNew = () => {
    setEdit({
      id: "",
      paket_id: "",
      title: "",
      desc: "",
      variants: "",
      images: [],
    });
    setImages([]);
    setIsNew(true);
  };

  // Edit item yang sudah ada
  const startEdit = (item: OlehOlehItem) => {
    setEdit({ ...item });
    setImages([...item.images]);
    setIsNew(false);
  };

  const cancelEdit = () => {
    setEdit(null);
    setIsNew(false);
  };

  // Upload gambar & konversi WebP
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const webpBase64 = await processImageToWebP(file);
        setImages((prev) => [...prev, webpBase64]);
      } catch (err) {
        console.error(err);
        alert("Gagal mengompres gambar.");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Simpan
  const handleSave = useCallback(async () => {
    if (!edit) return;
    const payload = { ...edit, images };
    setLoading(true);
    try {
      const res = await fetch("/api/oleh-oleh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEdit(null);
      setIsNew(false);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [edit, images, fetchData]);

  // Hapus
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Hapus oleh‑oleh ini? Tindakan tidak dapat dibatalkan.")) return;
      try {
        await fetch("/api/oleh-oleh", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        fetchData();
      } catch (err: any) {
        alert("Gagal menghapus: " + err.message);
      }
    },
    [fetchData]
  );

  // ========== FORM VIEW ==========
  if (edit) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-w-3xl mx-auto animate-in fade-in">
        <h3 className="text-2xl font-bold text-stone-800 mb-1">
          {isNew ? "Tambah Oleh‑oleh" : "Edit Oleh‑oleh"}
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Atur nama produk, paket terkait, varian, dan unggah gambar.
        </p>

        <div className="space-y-5">
          {/* Paket ID */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Paket Terkait (Edukasi, Wisata Budaya, Outbound, Live In)
            </label>
            <input
              type="text"
              value={edit.paket_id}
              onChange={(e) => setEdit({ ...edit, paket_id: e.target.value })}
              placeholder="Contoh: Edukasi"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Judul */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Judul Produk</label>
            <input
              type="text"
              value={edit.title}
              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
              placeholder="Contoh: Oleh-Oleh Paket Edukasi"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={edit.desc}
              onChange={(e) => setEdit({ ...edit, desc: e.target.value })}
              placeholder="Tulis deskripsi produk..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Varian */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Varian (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={edit.variants}
              onChange={(e) => setEdit({ ...edit, variants: e.target.value })}
              placeholder="Contoh: Paket Pemula, Paket Lengkap"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
            {edit.variants && (
              <div className="flex flex-wrap gap-2 mt-2">
                {edit.variants.split(",").map((v, i) => {
                  const trimmed = v.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200"
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upload Gambar */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 border-dashed">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-700">
                Gambar Produk (unggah beberapa, responsif)
              </label>
              <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition">
                <Upload className="text-xs" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <p className="text-sm text-emerald-600 font-medium mb-3 flex items-center gap-1">
                <span className="inline-block animate-spin">⏳</span> Mengompres...
              </p>
            )}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-stone-300 shadow-sm"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Gambar ${idx + 1}`}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      title="Hapus gambar"
                    >
                      <X className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 mt-1">Belum ada gambar.</p>
            )}
          </div>

          {/* Tombol simpan */}
          <div className="flex gap-3 pt-4 border-t border-stone-200">
            <button
              onClick={handleSave}
              disabled={loading || isUploading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span> Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 /> Simpan
                </>
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-stone-800">Oleh‑oleh</h3>
          <p className="text-sm text-stone-500">
            Kelola produk oleh‑oleh yang ditawarkan kepada pengunjung.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus /> Tambah Oleh‑oleh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
              {item.images[0] && (
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src={item.images[0]}
                    className="w-full h-full object-cover"
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-800 text-lg">{item.title}</h4>
                <p className="text-sm text-stone-500 line-clamp-1">
                  Paket: {item.paket_id}
                  {item.variants && ` • Varian: ${item.variants}`}
                </p>
                {item.images.length > 0 && (
                  <p className="text-xs text-emerald-700 mt-1">
                    {item.images.length} gambar
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => startEdit(item)}
                className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 border border-amber-200 transition"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 transition"
                title="Hapus"
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-stone-400 py-8">
            Belum ada produk oleh‑oleh. Klik “Tambah Oleh‑oleh” untuk memulai.
          </p>
        )}
      </div>
    </div>
  );
}