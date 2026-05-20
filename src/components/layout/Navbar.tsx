// src/components/layout/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, Menu, X, ArrowRight, EditIcon, UserCircle, SignOut } from "@/components/ui/Icons";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "@/components/ui/LoginModal";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Cek session awal
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setIsLoggedIn(!!session);
    });

    // Dengarkan perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Artikel", href: "/artikel" },
    { label: "Edukasi", href: "/edukasi" },
    { label: "Paket & Oleh-Oleh", href: "/paket" },
    { label: "Galeri", href: "/galeri" },
    { label: "Kemitraan", href: "/kemitraan" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-700 transition-colors flex items-center justify-center w-10 h-10">
                <Leaf className="text-white text-lg" />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-tight text-emerald-800">Kampung Berseri</h1>
                <p className="text-xs text-amber-700 font-medium tracking-wider uppercase">Sulang Kidul</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="font-medium text-stone-600 hover:text-emerald-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link href="/dashboard" className="font-medium text-amber-600 hover:text-amber-700 flex items-center gap-2">
                  <EditIcon className="text-sm" /> Dashboard
                </Link>
              )}
              <Link href="/paket" className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm flex items-center gap-2">
                Booking <ArrowRight />
              </Link>
              <div className="pl-4 border-l border-stone-200">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="text-stone-500 hover:text-red-600 transition-colors" title="Logout">
                    <SignOut className="text-xl" />
                  </button>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="text-stone-500 hover:text-emerald-600 transition-colors" title="Login Admin">
                    <UserCircle className="text-xl" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/paket" className="text-sm bg-amber-600 text-white px-3 py-1.5 rounded-full font-medium">Booking</Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-stone-500 hover:text-red-600"><SignOut className="text-lg" /></button>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="text-stone-500 hover:text-emerald-600"><UserCircle className="text-lg" /></button>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-600 w-8 h-8 flex items-center justify-center text-xl">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 absolute w-full shadow-lg z-50">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-emerald-600">
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50">
                  ⚙️ Dashboard Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}