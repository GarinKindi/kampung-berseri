"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const ImageSlider = dynamic(() => import("@/components/ui/ImageSlider"), { ssr: false });
const BookingModal = dynamic(() => import("@/components/ui/BookingModal"), { ssr: false });
const OlehModal = dynamic(() => import("@/components/ui/OlehModal"), { ssr: false });
import { formatRupiah } from "@/lib/utils";
import { PackageItem, OlehOlehItem } from "@/types";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Leaf,
  MessageCircle,
  MapIcon,
  Compass,
  Tent,
  HomeIcon,
} from "@/components/ui/Icons";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  MapIcon,
  Compass,
  Tent,
  HomeIcon,
};

export default function PaketPage() {
  const [packagesData, setPackagesData] = useState<PackageItem[]>([]);
  const [olehOlehData, setOlehOlehData] = useState<OlehOlehItem[]>([]);
  const [bookingPkg, setBookingPkg] = useState<PackageItem | null>(null);
  const [olehModal, setOlehModal] = useState<OlehOlehItem | null>(null);
  const waAdminPaket = process.env.NEXT_PUBLIC_WA_ADMIN_PAKET || "6285643545567";
  const waAdminOleh = process.env.NEXT_PUBLIC_WA_ADMIN_OLEH || "6285643545567";
  const olehRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch data dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: pkgs } = await supabase.from("packages").select("*");
      const { data: olehs } = await supabase.from("oleh_oleh").select("*");
      setPackagesData(pkgs || []);
      setOlehOlehData(olehs || []);
    };
    fetchData();
  }, []);

  // Body scroll lock saat modal terbuka
  useEffect(() => {
    if (bookingPkg || olehModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [bookingPkg, olehModal]);

  // Scroll ke oleh-oleh setelah booking
  useEffect(() => {
    if (!bookingPkg && olehRef.current) {
      olehRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bookingPkg]);

  return (
    <div className="bg-stone-50 min-h-screen animate-in fade-in relative">
      {/* Header Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">
            Reservasi Cepat & Mudah
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 mt-2 mb-4">
            Pilih Paket Wisata Anda
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Eksplorasi pilihan kegiatan kami. Isi data dengan cepat, dan sistem
            akan langsung menghubungkan Anda ke WhatsApp Admin.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {packagesData.map((pkg) => {
            const IconComponent = iconMap[pkg.icon] || MapIcon;
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-stone-200 flex flex-col h-full relative group"
              >
                <ImageSlider
                  images={pkg.images}
                  heightClass="h-64"
                  priceOverlay={formatRupiah(pkg.price)}
                />
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-stone-100 rounded-lg">
                      <IconComponent className="text-xl text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-800">
                      {pkg.name}
                    </h3>
                  </div>
                  <p className="text-stone-600 mb-6 leading-relaxed flex-grow">
                    {pkg.desc}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2 text-stone-800 font-bold border-b border-stone-100 pb-2">
                      <Calendar className="text-emerald-600" /> {pkg.duration}
                    </div>
                    <ul className="space-y-2">
                      {pkg.activities.map((act, i) => (
                        <li
                          key={i}
                          className="text-stone-600 text-sm flex items-start gap-2"
                        >
                          <CheckCircle2 className="text-emerald-500 mt-1" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setBookingPkg(pkg)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-transform shadow-lg flex items-center justify-center gap-2 group-hover:-translate-y-1"
                  >
                    Pilih Paket & Booking Sekarang <ArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oleh-oleh Section */}
      <div
        ref={olehRef}
        className="bg-stone-900 py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Leaf className="text-white text-[500px] transform -translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Lengkapi Kunjungan dengan Oleh-Oleh
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg">
              Dukung pemberdayaan warga lokal. Pilih suvenir yang sesuai dengan
              tema paket kunjungan Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {olehOlehData.map((oo) => (
              <div
                key={oo.id}
                className="bg-stone-800 border border-stone-700 rounded-2xl overflow-hidden flex flex-col hover:border-amber-500 transition-colors group"
              >
                <div className="h-40 overflow-hidden relative">
                  <ImageSlider images={oo.images} heightClass="h-40" />
                  <div className="absolute bottom-2 left-2 z-30 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-sm border border-stone-700 shadow-md">
                    Paket {oo.paket_id}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow relative z-20">
                  <h4 className="font-bold text-white mb-2">{oo.title}</h4>
                  <p className="text-stone-400 text-sm mb-6 flex-grow">
                    {oo.desc}
                  </p>
                  <button
                    onClick={() => setOlehModal(oo)}
                    className="w-full bg-green-500 hover:bg-green-400 text-stone-950 font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle /> Pesan via WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Booking Paket */}
      {bookingPkg && (
        <BookingModal
          pkg={bookingPkg}
          waNumber={waAdminPaket}
          onClose={() => setBookingPkg(null)}
        />
      )}

      {/* Modal Oleh-oleh (dengan form varian & alamat) */}
      {olehModal && (
        <OlehModal
          item={olehModal}
          waNumber={waAdminOleh}
          onClose={() => setOlehModal(null)}
        />
      )}
    </div>
  );
}