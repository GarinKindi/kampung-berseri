// src/types/index.ts
export interface HeroData {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    desc: string;
    bgImage: string;
  }
  
  export interface EducationItem {
    id: string;
    title: string;
    icon: string; // nama ikon, misal: "Droplet", "Leaf"
    desc: string;
    details: { label: string; value: string }[];
    image: string;
  }
  
  export interface PackageItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    duration: string;
    desc: string;
    activities: string[];
    facilities: string[];
    images: string[];
  }
  
  export interface OlehOlehItem {
  id: string;
  paket_id: string;   // ✅ sesuai database
  title: string;
  desc: string;
  variants: string;
  images: string[];
}
  
  export interface Partner {
    name: string;
    type: 'Instansi Pemerintah' | 'Universitas' | 'Sekolah' | 'Perusahaan' | 'Komunitas';
    logo: string;
    badge: string; // class Tailwind
  }
  
  export interface Article {
    id: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    content: string;
    image: string;
  }
  
  export interface FooterData {
    desc: string;
    address: string;
    phone: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    mapsUrl: string;
  }
  
  export interface AdminConfig {
    waPaket: string;
    waOleh: string;
    waKemitraan: string;
  }