// Contoh: src/app/layout.tsx (Tambahkan tombol logout ke navbar)
'use client'; // Pastikan layout adalah Client Component jika menggunakan useRouter

import '../globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { logout, getToken } from './lib/auth'; // Import logout dan getToken

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = getToken(); // Periksa apakah token ada untuk menampilkan tombol logout

  const handleLogout = async () => {
    await logout(router); // Panggil fungsi logout
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ padding: '15px', background: '#f0f0f0', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            Home
          </Link>
          <Link href="/products" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            Produk
          </Link>
          {!token ? ( // Tampilkan link Login/Register jika tidak ada token
            <>
              <Link href="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                Login
              </Link>
              <Link href="/register" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                Daftar
              </Link>
            </>
          ) : ( // Tampilkan tombol Logout jika ada token
            <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
              Logout
            </button>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}