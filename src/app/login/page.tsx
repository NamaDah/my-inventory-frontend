'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storeToken } from "../lib/auth";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed.');
            }

            const data = await response.json();
            storeToken(data.token);

            router.push('/products')
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during login');
            console.error("Login Error:", err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Login</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Belum punya akun? <Link href="/register">Daftar di sini</Link>
            </p>
        </div>
    );
}