// src/components/sections/ArticleContent.tsx
"use client";
import { Article } from "@/types";
import { ChevronLeft, Calendar, UserCircle } from "@/components/ui/Icons";
import Link from "next/link";

export default function ArticleContent({ article }: { article: Article }) {
  if (!article) return null;
  return (
    <div className="bg-stone-50 min-h-screen py-12 animate-in fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/artikel" className="mb-8 flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold transition-colors bg-white px-4 py-2 rounded-full shadow-sm w-fit border border-stone-200">
          <ChevronLeft /> Kembali ke Daftar Artikel
        </Link>

        <div className="bg-white rounded-3xl shadow-md border border-stone-200 overflow-hidden">
          <div className="h-64 md:h-[400px] w-full relative">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm font-medium mb-3">
                <span className="bg-emerald-600/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar className="text-[10px]" /> {article.date}
                </span>
                <span className="bg-stone-800/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                  <UserCircle /> {article.author}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{article.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="prose prose-stone prose-emerald max-w-none text-stone-700 text-lg leading-relaxed space-y-6">
              {article.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? <p key={i} className="text-justify">{paragraph}</p> : <br key={i} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}