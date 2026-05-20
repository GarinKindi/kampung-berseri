"use client";
import { useState } from "react";
import { X, Leaf, UserCircle } from "@/components/ui/Icons";
import { createClient } from "@/lib/supabase/client"; // ✅ path benar

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Hijau identik */}
        <div className="bg-emerald-600 p-6 text-white relative">
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-lg">
              <UserCircle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Login Admin</h3>
              <p className="text-emerald-200 text-xs">Sistem Pengelolaan Web</p>
            </div>
          </div>
          <button
            aria-label="Tutup Panel Login"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"
          >
            <X />
          </button>
          <Leaf className="absolute right-0 top-0 text-white text-6xl opacity-10 transform translate-x-4 -translate-y-4" />
        </div>

        {/* Form identik */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5 bg-stone-50">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="text-stone-400" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@kampungberseri.com"
                className="w-full pl-10 border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-stone-400"></i>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Masuk...' : 'Masuk Sistem'}
          </button>

          {/* Info demo (nanti bisa disesuaikan) */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-700">
            <span className="font-bold">Info Demo:</span><br />
            Email: <b>admin@kampungberseri.com</b> | Password: <b>admin123</b>
          </div>
        </form>
      </div>
    </div>
  );
}