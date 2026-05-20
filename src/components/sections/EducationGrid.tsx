import { EducationItem } from "@/types";
import { Droplet, Leaf, Tractor, Sprout } from "@/components/ui/Icons";

const iconMap: Record<string, React.ElementType> = {
  Droplet,
  Leaf,
  Tractor,
  Sprout,
};

export default function EducationGrid({ educationData }: { educationData: EducationItem[] }) {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Materi Edukasi Kami</h2>
          <div className="w-24 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {educationData.map((item) => {
            const IconComponent = iconMap[item.icon] || Leaf;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
                <div className="bg-stone-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="text-2xl text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}