"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/Icons";

interface ImageSliderProps {
  images: string[];
  heightClass?: string;
  priceOverlay?: string;
}

export default function ImageSlider({ images, heightClass = "h-64 md:h-72", priceOverlay }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [images, isPaused]);

  const prevSlide = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }, [images.length]);
  const nextSlide = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`relative ${heightClass} w-full overflow-hidden group rounded-t-3xl`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Slide ${idx + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent z-10"></div>

      {images.length > 1 && (
        <>
          <button aria-label="Gambar Sebelumnya" onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center">
            <ChevronLeft />
          </button>
          <button aria-label="Gambar Selanjutnya" onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center">
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-amber-400 w-4' : 'bg-white/50 w-1.5'}`}></div>
            ))}
          </div>
        </>
      )}

      {priceOverlay && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-amber-500 text-stone-900 font-bold px-3 py-1.5 rounded-lg text-sm shadow-md">
            {priceOverlay} <span className="text-xs font-medium">/ pax</span>
          </span>
        </div>
      )}
    </div>
  );
}