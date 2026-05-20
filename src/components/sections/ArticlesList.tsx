// src/components/sections/ArticlesList.tsx
"use client";
import { Article } from "@/types";
import { Calendar, UserCircle, ArrowRight } from "@/components/ui/Icons";
import Link from "next/link";

interface ArticlesListProps {
  articles: Article[];
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((art) => (
        <Link
          key={art.id}
          href={`/artikel/${art.id}`}
          className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-200 flex flex-col group cursor-pointer"
        >
          <div className="h-56 overflow-hidden relative">
            <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-emerald-800 font-bold text-xs shadow-sm flex items-center gap-1.5">
              <Calendar className="text-[10px]" /> {art.date}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">{art.title}</h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{art.excerpt}</p>
            <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-auto">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                <UserCircle className="text-lg text-emerald-500" /> {art.author}
              </span>
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                Baca <ArrowRight className="text-xs" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}