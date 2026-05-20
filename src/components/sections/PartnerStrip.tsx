import { Partner } from "@/types";
import Link from "next/link";

export default function PartnerStrip({ partnersData }: { partnersData: Partner[] }) {
  return (
    <section className="py-16 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-8">Telah Dipercaya & Dikunjungi Oleh</p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 opacity-90 hover:opacity-100 transition-all duration-500">
          {partnersData.slice(0, 5).map((mitra) => (
            <div key={mitra.name} className="flex items-center gap-3 bg-stone-50 px-5 py-2.5 rounded-full border border-stone-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <img src={mitra.logo} alt={mitra.name} className="w-7 h-7 rounded-full object-cover shadow-sm" />
              <span className="font-bold text-stone-700 text-sm">{mitra.name}</span>
            </div>
          ))}
          <Link href="/kemitraan" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 ml-2">
            Lihat Semua Mitra
          </Link>
        </div>
      </div>
    </section>
  );
}