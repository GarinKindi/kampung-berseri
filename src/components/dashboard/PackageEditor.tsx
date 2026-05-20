"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { PackageItem } from "@/types";

export default function PackageEditor() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [editPkg, setEditPkg] = useState<PackageItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activities, setActivities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchPackages = useCallback(async () => {
    const { data } = await supabase.from("packages").select("*");
    setPackages(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const startNew = useCallback(() => {
    setEditPkg({
      id: "",
      name: "",
      icon: "MapIcon",
      price: 0,
      duration: "",
      desc: "",
      activities: [],
      facilities: [],
      images: [],
    });
    setActivities([]);
    setFacilities([]);
    setImages([]);
    setIsNew(true);
  }, []);

  const startEdit = useCallback((pkg: PackageItem) => {
    setEditPkg({ ...pkg });
    setActivities([...pkg.activities]);
    setFacilities([...pkg.facilities]);
    setImages([...pkg.images]);
    setIsNew(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditPkg(null);
    setIsNew(false);
  }, []);

  // Activities
  const addActivity = useCallback(() => setActivities((prev) => [...prev, ""]), []);
  const updateActivity = useCallback((index: number, value: string) => {
    setActivities((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  }, []);
  const removeActivity = useCallback((index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Facilities
  const addFacility = useCallback(() => setFacilities((prev) => [...prev, ""]), []);
  const updateFacility = useCallback((index: number, value: string) => {
    setFacilities((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  }, []);
  const removeFacility = useCallback((index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Images – upload asinkron tanpa blokir UI
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);
  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editPkg) return;
    const payload = {
      ...editPkg,
      price: Number(editPkg.price),
      activities,
      facilities,
      images,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEditPkg(null);
      setIsNew(false);
      fetchPackages();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [editPkg, activities, facilities, images, fetchPackages]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Hapus paket ini? Tindakan tidak dapat dibatalkan.")) return;
    try {
      await fetch("/api/packages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchPackages();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  }, [fetchPackages]);

  // Daftar paket di-memo biar tidak render ulang terus
  const packageList = useMemo(() => packages.map((pkg) => (
    <div
      key={pkg.id}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
        {pkg.images[0] && (
          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={pkg.images[0]}
              className="w-full h-full object-cover"
              alt={pkg.name}
              loading="lazy"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-stone-800 text-lg">{pkg.name}</h4>
          <p className="text-sm text-stone-500 line-clamp-1">
            {pkg.duration} • Rp {pkg.price.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            {pkg.activities.length} aktivitas • {pkg.facilities.length} fasilitas
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0">
        <button
          onClick={() => startEdit(pkg)}
          className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 border border-amber-200 transition"
          title="Edit"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => handleDelete(pkg.id)}
          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 transition"
          title="Hapus"
        >
          <Trash />
        </button>
      </div>
    </div>
  )), [packages, startEdit, handleDelete]);

  // ========== FORM VIEW ==========
  if (editPkg) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-w-3xl mx-auto animate-in fade-in">
        <h3 className="text-2xl font-bold text-stone-800 mb-1">
          {isNew ? "Tambah Paket Wisata" : "Edit Paket Wisata"}
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Atur informasi paket, aktivitas, fasilitas, dan unggah gambar.
        </p>

        <div className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Nama Paket</label>
            <input
              type="text"
              value={editPkg.name}
              onChange={(e) => setEditPkg({ ...editPkg, name: e.target.value })}
              placeholder="Contoh: Edukasi Desa"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Ikon & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Ikon (MapIcon, Compass, Tent, HomeIcon)
              </label>
              <input
                type="text"
                value={editPkg.icon}
                onChange={(e) => setEditPkg({ ...editPkg, icon: e.target.value })}
                placeholder="MapIcon"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Harga (Rp)</label>
              <input
                type="number"
                min={0}
                value={editPkg.price}
                onChange={(e) => setEditPkg({ ...editPkg, price: Number(e.target.value) })}
                placeholder="75000"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Durasi</label>
            <input
              type="text"
              value={editPkg.duration}
              onChange={(e) => setEditPkg({ ...editPkg, duration: e.target.value })}
              placeholder="Setengah Hari (4 Jam)"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={editPkg.desc}
              onChange={(e) => setEditPkg({ ...editPkg, desc: e.target.value })}
              placeholder="Deskripsikan pengalaman yang akan didapat..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Activities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-700">Aktivitas</label>
              <button
                type="button"
                onClick={addActivity}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="text-xs" /> Tambah
              </button>
            </div>
            <div className="space-y-2">
              {activities.map((act, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={act}
                    onChange={(e) => updateActivity(idx, e.target.value)}
                    placeholder={`Aktivitas ${idx + 1}`}
                    className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeActivity(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-700">Fasilitas</label>
              <button
                type="button"
                onClick={addFacility}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="text-xs" /> Tambah
              </button>
            </div>
            <div className="space-y-2">
              {facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fac}
                    onChange={(e) => updateFacility(idx, e.target.value)}
                    placeholder={`Fasilitas ${idx + 1}`}
                    className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeFacility(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 border-dashed">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-700">
                Gambar Paket (unggah beberapa, responsif)
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
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-300 shadow-sm">
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
                  <CheckCircle2 /> Simpan Paket
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
          <h3 className="text-2xl font-bold text-stone-800">Paket Wisata</h3>
          <p className="text-sm text-stone-500">
            Kelola paket wisata yang ditawarkan kepada pengunjung.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus /> Tambah Paket
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {packageList}
        {packages.length === 0 && (
          <p className="text-center text-stone-400 py-8">
            Belum ada paket wisata. Klik "Tambah Paket" untuk memulai.
          </p>
        )}
      </div>
    </div>
  );
}