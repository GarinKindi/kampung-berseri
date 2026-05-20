"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { processImageToWebP } from "@/lib/utils";
import { Plus, EditIcon, Trash, X, CheckCircle2 } from "@/components/ui/Icons";

interface Detail {
  label: string;
  value: string;
}

interface Education {
  id: string;
  title: string;
  icon: string;
  desc: string;
  details: Detail[];
  image: string;
}

export default function EducationEditor() {
  const [items, setItems] = useState<Education[]>([]);
  const [editItem, setEditItem] = useState<Education | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("education").select("*");
    setItems(data || []);
  };

  const startNew = () => {
    setEditItem({
      id: "",
      title: "",
      icon: "Leaf",
      desc: "",
      details: [],
      image: "",
    });
    setIsNew(true);
  };

  const startEdit = (item: Education) => {
    setEditItem({ ...item });
    setIsNew(false);
  };

  const cancelEdit = () => {
    setEditItem(null);
    setIsNew(false);
  };

  const addDetail = () => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      details: [...editItem.details, { label: "", value: "" }],
    });
  };

  const updateDetail = (index: number, field: "label" | "value", val: string) => {
    if (!editItem) return;
    const newDetails = [...editItem.details];
    newDetails[index][field] = val;
    setEditItem({ ...editItem, details: newDetails });
  };

  const removeDetail = (index: number) => {
    if (!editItem) return;
    const newDetails = editItem.details.filter((_, i) => i !== index);
    setEditItem({ ...editItem, details: newDetails });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webpBase64 = await processImageToWebP(file);
      setEditItem((prev) => (prev ? { ...prev, image: webpBase64 } : prev));
    } catch (err) {
      console.error(err);
      alert("Gagal mengompres gambar.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!editItem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEditItem(null);
      setIsNew(false);
      fetchItems();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus materi ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      await fetch("/api/education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchItems();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  // ========== FORM VIEW ==========
  if (editItem) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-stone-800 mb-1">
          {isNew ? "Tambah Materi Edukasi" : "Edit Materi Edukasi"}
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Lengkapi informasi materi edukasi. Gunakan ikon yang sesuai dan unggah gambar cover.
        </p>

        <div className="space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Judul Materi</label>
            <input
              type="text"
              value={editItem.title}
              onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
              placeholder="Contoh: Pupuk Organik Cair (POC)"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Ikon */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Ikon (nama ikon dari daftar: Droplet, Leaf, Tractor, Sprout)
            </label>
            <input
              type="text"
              value={editItem.icon}
              onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
              placeholder="Droplet"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={editItem.desc}
              onChange={(e) => setEditItem({ ...editItem, desc: e.target.value })}
              placeholder="Jelaskan materi ini dalam 1-2 kalimat..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Upload Gambar */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 border-dashed">
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Gambar Cover (otomatis dikonversi ke WebP)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {editItem.image && (
                <div className="w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-stone-300 shadow-sm">
                  <img
                    src={editItem.image}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer transition-colors"
                />
                {isUploading && (
                  <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    <span className="inline-block animate-spin">⏳</span> Mengompres...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detail (tabel) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-700">Detail Materi (Label & Nilai)</label>
              <button
                type="button"
                onClick={addDetail}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="text-xs" /> Tambah Baris
              </button>
            </div>
            <div className="space-y-3">
              {editItem.details.map((det, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <input
                    type="text"
                    value={det.label}
                    onChange={(e) => updateDetail(idx, "label", e.target.value)}
                    placeholder="Label (Kandungan)"
                    className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={det.value}
                    onChange={(e) => updateDetail(idx, "value", e.target.value)}
                    placeholder="Nilai (Nitrogen, Fosfor...)"
                    className="flex-[2] border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Hapus detail"
                  >
                    <X className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol aksi */}
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
                  <CheckCircle2 /> Simpan Materi
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
          <h3 className="text-2xl font-bold text-stone-800">Konten Edukasi</h3>
          <p className="text-sm text-stone-500">
            Kelola materi edukasi yang tampil di halaman Beranda dan Edukasi.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus /> Tambah Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0 w-full sm:w-auto">
              {item.image && (
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-800 text-lg">{item.title}</h4>
                <p className="text-sm text-stone-500 line-clamp-1 max-w-md">
                  {item.desc}
                </p>
                {item.details && item.details.length > 0 && (
                  <p className="text-xs text-emerald-700 mt-1">
                    {item.details.length} detail • Ikon: {item.icon}
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
            Belum ada materi edukasi. Klik "Tambah Baru" untuk memulai.
          </p>
        )}
      </div>
    </div>
  );
}