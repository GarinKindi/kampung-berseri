"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { processImageToWebP } from "@/lib/utils";
import { Plus, EditIcon, Trash, CheckCircle2, Upload } from "@/components/ui/Icons";
import { Article } from "@/types";

export default function ArticleEditor() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [edit, setEdit] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchArticles = useCallback(async () => {
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setArticles(data || []);
  }, [supabase]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const startNew = () => {
    // ID dihasilkan otomatis agar tidak pernah kosong
    const newId = 'art-' + Date.now().toString();
    setEdit({
      id: newId,
      title: '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Admin Kampung Berseri',
      excerpt: '',
      content: '',
      image: '',
    });
    setIsNew(true);
  };

  const startEdit = (art: Article) => {
    setEdit({ ...art });
    setIsNew(false);
  };

  const cancelEdit = () => setEdit(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webp = await processImageToWebP(file);
      setEdit((prev) => (prev ? { ...prev, image: webp } : prev));
    } catch {
      alert("Gagal mengompres gambar.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!edit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEdit(null);
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [edit, fetchArticles]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      await fetch("/api/articles", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }, [fetchArticles]);

  if (edit) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-3xl mx-auto animate-in fade-in">
        <h3 className="text-2xl font-bold mb-4">{isNew ? "Tulis Artikel Baru" : "Edit Artikel"}</h3>
        <div className="space-y-4">
          <input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} placeholder="Judul artikel" className="w-full border rounded-xl px-4 py-3 font-bold" />
          <div className="grid grid-cols-2 gap-4">
            <input value={edit.author} onChange={e => setEdit({ ...edit, author: e.target.value })} placeholder="Penulis" className="w-full border rounded-xl px-4 py-3" />
            <input value={edit.date} onChange={e => setEdit({ ...edit, date: e.target.value })} placeholder="Tanggal (contoh: 18 Mei 2026)" className="w-full border rounded-xl px-4 py-3" />
          </div>
          <textarea value={edit.excerpt} onChange={e => setEdit({ ...edit, excerpt: e.target.value })} placeholder="Ringkasan / kutipan pembuka" rows={2} className="w-full border rounded-xl px-4 py-3" />
          <textarea value={edit.content} onChange={e => setEdit({ ...edit, content: e.target.value })} placeholder="Isi artikel lengkap..." rows={10} className="w-full border rounded-xl px-4 py-3" />
          
          <div className="bg-stone-50 p-4 rounded-xl border border-dashed">
            <label className="text-sm font-bold mb-2 block">Gambar Sampul (unggah, otomatis WebP)</label>
            <div className="flex items-center gap-4 flex-wrap">
              {edit.image && <img src={edit.image} className="w-32 h-20 object-cover rounded-xl border" alt="Preview" />}
              <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                <Upload className="text-xs" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
              {isUploading && <span className="text-sm text-emerald-600">⏳ Mengompres...</span>}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={handleSave} disabled={loading || isUploading} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 /> Simpan Artikel
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
          <h3 className="text-2xl font-bold">Artikel & SEO</h3>
          <p className="text-sm text-stone-500">Kelola artikel yang tampil di halaman blog.</p>
        </div>
        <button onClick={startNew} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"><Plus /> Tulis Artikel</button>
      </div>
      <div className="grid gap-4">
        {articles.map((art) => (
          <div key={art.id || Math.random().toString()} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border">
            <div className="flex items-center gap-4">
              {art.image && <img src={art.image} className="w-14 h-14 object-cover rounded-lg" />}
              <div>
                <h4 className="font-bold line-clamp-1">{art.title}</h4>
                <p className="text-xs text-stone-500">{art.date} • {art.author}</p>
                <p className="text-xs text-stone-400 line-clamp-1">{art.excerpt}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(art)} className="p-2 bg-amber-50 text-amber-600 rounded-lg"><EditIcon /></button>
              <button onClick={() => handleDelete(art.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}