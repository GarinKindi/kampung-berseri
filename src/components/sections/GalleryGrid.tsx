// src/components/sections/GalleryGrid.tsx
import Image from "next/image";

interface GalleryGridProps {
  images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, idx) => (
        <div
          key={idx}
          className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm"
        >
          <Image
            src={src}
            alt={`Galeri foto ${idx + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
}