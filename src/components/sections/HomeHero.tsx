// src/components/sections/HomeHero.tsx
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { HeroData } from "@/types";

export default function HomeHero({ heroData }: { heroData: HeroData }) {
  return (
    <section className="relative bg-emerald-900 h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.bgImage}
          alt={heroData.titleMain}
          fetchPriority="high"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left pt-20">
        <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-sm mb-4 border border-amber-500/30 backdrop-blur-sm">
          {heroData.badge}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
          {heroData.titleMain}{" "}
          <span className="text-amber-400">{heroData.titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-2xl font-light">
          {heroData.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="/paket"
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
          >
            Pilih Paket & Booking <ArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    </section>
  );
}