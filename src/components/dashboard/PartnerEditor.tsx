"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { processImageToWebP } from "@/lib/utils";
import { Plus, EditIcon, Trash, CheckCircle2, Upload, X } from "@/components/ui/Icons";
import { Partner } from "@/types";

export default function PartnerEditor() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [edit, setEdit] = useState<Partner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchPartners = useCallback(async () => {
    const { data } = await supabase.from("partners").select("*");
    setPartners(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const startNew = () => {
    setEdit({
      name: "",
      type: "Instansi Pemerintah",
      logo: "",
      badge: "bg-blue-50 text-blue-700",
    });
    setIsNew(true);
  };

  const startEdit = (p: Partner) => {
    setEdit({ ...p });
    setIsNew(false);
  };

  const cancelEdit = () => setEdit(null);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webp = await processImageToWebP(file);
      setEdit((prev) => (prev ? { ...prev, logo: webp } : prev));
    } catch {
      alert("Gagal mengompres logo.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!edit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEdit(null);
      fetchPartners();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [edit, fetchPartners]);

  const handleDelete = useCallback(async (name: string) => {
    if (!confirm("Hapus mitra ini?")) return;
    try {
      await fetch("/api/partners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchPartners();
    } catch (err: any) {
      alert(err.message);
    }
  }, [fetchPartners]);

  if (edit) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl mx-auto animate-in fade-in">
        <h3 className="text-2xl font-bold mb-4">{isNew ? "Tambah Mitra" : "Edit Mitra"}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold mb-1 block">Nama Mitra</label>
            <input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block">Tipe</label>
            <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value as Partner["type"] })} className="w-full border rounded-xl px-4 py-3 bg-white">
              <option>Instansi Pemerintah</option>
              <option>Universitas</option>
              <option>Sekolah</option>
              <option>Perusahaan</option>
              <option>Komunitas</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block">Badge Class</label>
            <input value={edit.badge} onChange={e => setEdit({ ...edit, badge: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="bg-blue-50 text-blue-700" />
          </div>
          <div className="bg-stone-50 p-4 rounded-xl border border-dashed">
            <label className="text-sm font-bold mb-2 block">Logo (unggah, otomatis WebP)</label>
            <div className="flex items-center gap-4">
              {edit.logo && <img src={edit.logo} className="w-16 h-16 rounded-full object-cover border" alt="Preview" />}
              <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                <Upload className="text-xs" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
              </label>
              {isUploading && <span className="text-sm text-emerald-600">⏳ Mengompres...</span>}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <button onClick={handleSave} disabled={loading || isUploading} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 /> Simpan
            </button>
            <button onClick={cancelEdit} className="bg-stone-200 px-6 py-3 rounded-xl font-bold">Batal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold">Mitra & Kunjungan</h3>
          <p className="text-sm text-stone-500">Kelola daftar mitra yang tampil di halaman Kemitraan.</p>
        </div>
        <button onClick={startNew} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"><Plus /> Tambah Mitra</button>
      </div>
      <div className="grid gap-4">
        {partners.map((p) => (
          <div key={p.name} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border">
            <div className="flex items-center gap-4">
              {p.logo && <img src={p.logo} className="w-10 h-10 rounded-full object-cover border" />}
              <div>
                <h4 className="font-bold">{p.name}</h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.badge}`}>{p.type}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 bg-amber-50 text-amber-600 rounded-lg"><EditIcon /></button>
              <button onClick={() => handleDelete(p.name)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}