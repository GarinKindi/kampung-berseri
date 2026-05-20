"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ArticleContent from "@/components/sections/ArticleContent";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
}

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!id || id === "null" || id === "undefined") {
      setError("ID artikel tidak valid.");
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          setError(fetchError.message);
        } else if (!data) {
          setError("Artikel tidak ditemukan");
        } else {
          setArticle(data);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Gagal Memuat</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Coba Lagi
            </button>
            <Link href="/artikel" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
              Kembali ke Artikel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-stone-600 mb-6">
            Artikel yang Anda cari mungkin sudah dihapus atau tidak tersedia.
          </p>
          <Link href="/artikel" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
            Kembali ke Artikel
          </Link>
        </div>
      </div>
    );
  }

  return <ArticleContent article={article} />;
}