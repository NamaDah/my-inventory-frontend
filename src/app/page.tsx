'use client'; // Gunakan directive ini untuk komponen klien di App Router

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    async function fetchBackendMessage() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
        const text = await response.text(); // Atau response.json() jika mengembalikan JSON
        setMessage(text);
      } catch (error) {
        console.error("Error fetching backend message:", error);
        setMessage('Failed to connect to backend.');
      }
    }
    fetchBackendMessage();
  }, []); // [] agar hanya dijalankan sekali saat komponen dimount

  return (
    <main>
      <h1>Frontend Anda Berjalan!</h1>
      <p>Pesan dari Backend: {message}</p>
      {/* Tambahkan konten frontend Anda di sini */}
    </main>
  );
}