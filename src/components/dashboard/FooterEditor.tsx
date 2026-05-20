"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, MapPin } from "@/components/ui/Icons";

export default function FooterEditor() {
  const [footer, setFooter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("footer")
      .select("*")
      .single()
     .then(({ data }: { data: any }) => setFooter(data));
  }, [supabase]);

  const handleSave = async () => {
    if (!footer) return;
    setLoading(true);
    try {
      const res = await fetch("/api/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      alert("Footer berhasil diperbarui!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!footer) return <p className="p-4">Memuat data footer...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-stone-800 mb-2">Footer & Kontak</h3>
      <p className="text-sm text-stone-500 mb-6">
        Kelola informasi yang tampil di bagian paling bawah semua halaman.
        Setelah diisi, klik <strong>Simpan Footer</strong>.
      </p>

      <div className="space-y-5">
        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Deskripsi Singkat
          </label>
          <textarea
            value={footer.desc || ""}
            onChange={(e) => setFooter({ ...footer, desc: e.target.value })}
            rows={3}
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Contoh: Destinasi wisata edukasi berbasis desa yang berfokus pada..."
          />
          <p className="text-xs text-stone-400 mt-1">
            Tulis 1–3 kalimat yang menjelaskan Kampung Berseri. Ini akan
            muncul di kolom paling kiri footer.
          </p>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Alamat Lengkap
          </label>
          <input
            value={footer.address || ""}
            onChange={(e) => setFooter({ ...footer, address: e.target.value })}
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Sulang Kidul, Patalan, Jetis, Bantul, DIY 55681"
          />
          <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
            <MapPin className="text-xs" /> Alamat ini akan ditampilkan di kolom
            “Hubungi Kami” dan juga untuk SEO lokal.
          </p>
        </div>

        {/* Telepon */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Nomor Telepon
          </label>
          <input
            value={footer.phone || ""}
            onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
            className="w-full border rounded-xl px-4 py-3"
            placeholder="0856-4354-5567"
          />
          <p className="text-xs text-stone-400 mt-1">
            Gunakan format yang mudah dibaca, misal 0856-xxxx-xxxx.
          </p>
        </div>

        {/* Sosial Media */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Link Instagram
            </label>
            <input
              value={footer.instagram || ""}
              onChange={(e) =>
                setFooter({ ...footer, instagram: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Link YouTube
            </label>
            <input
              value={footer.youtube || ""}
              onChange={(e) =>
                setFooter({ ...footer, youtube: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Link TikTok
            </label>
            <input
              value={footer.tiktok || ""}
              onChange={(e) =>
                setFooter({ ...footer, tiktok: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="https://tiktok.com/..."
            />
          </div>
        </div>
        <p className="text-xs text-stone-400 -mt-4">
          Isi dengan URL lengkap akun sosial media. Biarkan kosong jika tidak
          ada.
        </p>

        {/* Google Maps */}
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            URL Embed Google Maps
          </label>
          <textarea
            value={footer.maps_url || ""}
            onChange={(e) =>
              setFooter({ ...footer, maps_url: e.target.value })
            }
            rows={2}
            className="w-full border rounded-xl px-4 py-3 font-mono text-sm"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-stone-400 mt-1">
            Buka Google Maps → cari lokasi → klik “Bagikan” → pilih
            “Sematkan peta” → salin kode di dalam{" "}
            <code className="bg-stone-100 px-1 rounded">src=&quot;...&quot;</code>.
          </p>
          {footer.maps_url && (
            <div className="rounded-xl overflow-hidden h-48 mt-2 border">
              <iframe
                src={footer.maps_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Peta Kampung Berseri"
              />
            </div>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 /> Simpan Footer
              </>
            )}
          </button>
          <p className="text-xs text-stone-400 mt-2">
            Perubahan langsung tampil di halaman depan setelah disimpan.
          </p>
        </div>
      </div>
    </div>
  );
}