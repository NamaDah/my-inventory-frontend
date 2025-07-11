// src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getToken } from '../lib/auth';

interface Category {
  id: number;
  name: string;
  products?: { id: number; name: string }[];
}

// Hapus interface ApiResponse ini jika backend mengembalikan array langsung
// interface ApiResponse {
//   data: Category[];
//   meta: {
//     page: number;
//     limit: number;
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = getToken();

        if (!token) {
          setError('Anda tidak login. Harap login untuk melihat kategori.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil kategori dari backend.');
        }

        // --- PERBAIKAN DI SINI ---
        // Jika backend mengembalikan array kategori secara langsung:
        const data: Category[] = await response.json(); // Data sekarang adalah array
        setCategories(data); // <--- Langsung setel data (yang sudah berupa array)
        // --- AKHIR PERBAIKAN ---

      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat mengambil kategori.');
        console.error("Kesalahan pengambilan kategori:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading category...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>List Categories Inventory</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {categories.map((category) => (
                    <div key={category.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0,1)' }}>
                        <h2 style={{ fontSize: '1.2em', marginBottom: '10px', color: '#333' }}>{category.name}</h2>
                        {category.products && category.products.length > 0 && (
                            <p style={{ fontSize: '0.9em', color: '#666' }}>({category.products.length} produk)</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

