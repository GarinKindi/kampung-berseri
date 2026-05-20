
"use client";
import { useState } from "react";
import { X, Leaf, MessageCircle, ArrowRight, Calendar, CheckCircle2 } from "@/components/ui/Icons";
import { PackageItem } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface BookingModalProps {
  pkg: PackageItem;
  waNumber: string;
  onClose: () => void;
}

export default function BookingModal({ pkg, waNumber, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({ nama: '', asal: '', jumlah: '', tanggal: '', catatan: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Admin Kampung Berseri 👋\n\nSaya ingin booking paket wisata:\n\n📦 Paket: ${pkg.name}\n👤 Nama: ${formData.nama}\n🏙️ Asal: ${formData.asal}\n👥 Jumlah Peserta: ${formData.jumlah} Orang\n📅 Tanggal Kunjungan: ${formData.tanggal}\n📝 Catatan: ${formData.catatan || '-'}\n\nMohon info detail dan total biayanya ya. Terima kasih 🙏`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center relative flex-none rounded-t-3xl">
          <div className="relative z-10">
            <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">Form Booking Cepat</p>
            <h3 className="text-xl font-extrabold leading-tight">{pkg.name}</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"><X /></button>
          <Leaf className="absolute right-0 top-0 text-white text-7xl opacity-10 transform translate-x-4 -translate-y-4" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-stone-50 overflow-y-auto flex-grow rounded-b-3xl">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Nama Pemesan <span className="text-red-500">*</span></label>
            <input type="text" required value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Budi / SMA N 1" className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Asal (Kota/Instansi) <span className="text-red-500">*</span></label>
            <input type="text" required value={formData.asal} onChange={(e)=>setFormData({...formData, asal: e.target.value})} placeholder="Contoh: Bantul" className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Jml Orang <span className="text-red-500">*</span></label>
              <input type="number" min="1" required value={formData.jumlah} onChange={(e)=>setFormData({...formData, jumlah: e.target.value})} placeholder="0" className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Tgl Kunjungan <span className="text-red-500">*</span></label>
              <input type="date" required value={formData.tanggal} onChange={(e)=>setFormData({...formData, tanggal: e.target.value})} className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Catatan (Opsional)</label>
            <input type="text" value={formData.catatan} onChange={(e)=>setFormData({...formData, catatan: e.target.value})} placeholder="Alergi makanan, dll." className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>

          <div className="pt-4 border-t border-stone-200 mt-2">
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-lg hover:-translate-y-1 group">
              <MessageCircle className="group-hover:scale-110 transition-transform" /> Lanjut ke WhatsApp
            </button>
            <p className="text-center text-xs text-stone-500 mt-3 font-medium">Anda akan diarahkan ke WhatsApp Admin dengan format pesanan rapi.</p>
          </div>
        </form>
      </div>
    </div>
  );
}