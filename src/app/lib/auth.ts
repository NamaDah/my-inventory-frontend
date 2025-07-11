import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const storeToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage.');
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        console.log('Token removed from localStorage.');
    }
};

export const logout = async (router: AppRouterInstance): Promise<void> => {
    const token = getToken();

    removeToken();

    if (token) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                console.log('Logout successful on backend');
            } else {
                console.error('Failed to logout on backend:', await response.text());
            }
        } catch (error) {
            console.error('Error calling backend logout API:', error);
        }
    }

    router.push('/login');
}