import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kampungberseri.id";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/edukasi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/paket`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/kemitraan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/artikel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // Halaman SEO baru
    { url: `${baseUrl}/wisata-edukasi-jogja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/study-tour-sekolah-jogja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/green-tourism-jogja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  const { data: articles } = await supabaseAdmin.from("articles").select("id,created_at");
  const articlePages: MetadataRoute.Sitemap = (articles || []).map((article: any) => ({
    url: `${baseUrl}/artikel/${article.id}`,
    lastModified: article.created_at ? new Date(article.created_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}