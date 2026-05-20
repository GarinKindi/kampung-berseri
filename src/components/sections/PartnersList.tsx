// src/components/sections/PartnersList.tsx
import { Partner } from "@/types";

interface PartnersListProps {
  partners: Partner[];
}

export default function PartnersList({ partners }: PartnersListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners.map((mitra) => (
        <div
          key={mitra.name}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
        >
          <img
            src={mitra.logo}
            alt={mitra.name}
            className="w-14 h-14 rounded-full object-cover border border-stone-100 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-stone-800 text-lg">{mitra.name}</h3>
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-2 ${mitra.badge}`}>
              {mitra.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}