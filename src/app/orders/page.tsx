'use client';

import { useEffect, useState } from 'react';
import { getToken, getUserRole } from '../lib/auth';


interface ProductInOrder {
    id: number
    name: string
    price: string
}

interface OrderItem {
    id: number
    productId: number
    quantity: number
    priceAtOrder: string
    product: ProductInOrder
}

interface Order {
    id: number
    userId: number
    totalAmounnt: string
    status: string
    createdAt: string
    user?: { id: number, email: string }
    orderItems: OrderItem[]
}

interface ApiResponse {
    data: Order[]
}

export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const BACKEND_URL = process.env.NEXT_PUBLI_BACKEND_URL;

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = getToken();
                const userRole = getUserRole();

                if (!token) {
                    setError('Unauthorized. Please login to see order');
                }

                const response = await fetch(`${BACKEND_URL}/api/orders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Fail fetching order from backend');
                }

                const data: Order[] = await response.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message || 'Unexpected error while fetch order');
                console.error("Fail fetch order:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', margin: '50px' }}>Load order...</div>
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</div>
    }

    if (orders.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>No order found</div>
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>List Order</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {orders.map((order) => (
                    <div key={order.id} style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,123,255,0.1)' }}>
                        <h2 style={{ fontSize: '1.4em', marginBottom: '10px', color: '#007bff' }}>Order #{order.id}</h2>
                        <p><strong>Amount:</strong> ${parseFloat(order.totalAmounnt).toFixed(2)} </p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        {order.user && <p><strong>Ordered by:</strong> {order.user.email}</p>}

                        <h3 style={{ fontSize: '1.1em', marginTop: '15px', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Order Items:</h3>
                        <ul style={{ listStyle: 'none', padding: '0' }}>
                            {order.orderItems.map((item) => (
                                <li key={item.id} style={{ marginBottom: '8px', background: '#f8f9fa', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'spaces-between', alignItems: 'center' }}>
                                    <span>{item.product.name} ({item.quantity}x)</span>
                                    <span>${parseFloat(item.priceAtOrder).toFixed(2)} / unit</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}