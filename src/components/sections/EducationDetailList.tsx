// src/components/sections/EducationDetailList.tsx
import { EducationItem } from "@/types";
import { CheckCircle2 } from "@/components/ui/Icons";

export default function EducationDetailList({ educationData }: { educationData: EducationItem[] }) {
  return (
    <div className="space-y-16">
      {educationData.map((data, index) => (
        <div key={data.id} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-lg group">
              <img src={data.image} alt={data.title} loading="lazy" className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-emerald-800 mb-3">{data.title}</h2>
              <p className="text-stone-600 text-lg">{data.desc}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <ul className="space-y-4">
                {data.details.map((detail, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-1/3 font-semibold text-emerald-700 flex items-start gap-2"><CheckCircle2 className="text-amber-500 mt-1" />{detail.label}</div>
                    <div className="w-2/3 text-stone-700">{detail.value}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}