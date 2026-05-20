// src/lib/utils.ts

/**
 * Format angka ke mata uang Rupiah (IDR)
 * Contoh: 75000 -> "Rp75.000"
 */
export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

/**
 * Konversi file gambar ke base64 WebP (di-compress, maks 2MB)
 * Cocok untuk upload di dashboard admin
 */
export const processImageToWebP = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Gagal: File yang diupload harus berupa gambar (JPG/PNG/GIF).');
      reject(new Error('Bukan file gambar'));
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Gagal: Ukuran gambar maksimal ${maxSizeMB}MB untuk menjaga performa web.`);
      reject(new Error('File terlalu besar'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
};