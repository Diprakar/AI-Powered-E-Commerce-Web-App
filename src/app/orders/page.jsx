'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const OrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchOrders = async () => {
        const res = await fetch('/api/orders')
        const data = await res.json()

        if (data.success) {
            setOrders(data.orders)
        } else {
            router.push('/login')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 text-lg">Loading orders...</p>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-3xl font-bold text-slate-900">No orders yet</h2>
                <Link href="/products" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
                    Shop Now
                </Link>
            </div>
        )
    }

    return (
        <main className="container mx-auto px-4 py-10">

            <h1 className="text-4xl font-bold text-slate-900 mb-10">Your Orders</h1>

            <div className="flex flex-col gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl border border-slate-200 p-6">

                        {/*  Header */}
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-sm text-slate-500">Order ID</p>
                                <p className="text-sm font-mono text-slate-700">{order._id}</p>
                            </div>


                            <div className="text-center">
                                <p className="text-sm text-slate-500">Status</p>
                                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    {order.status}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-500">Total</p>
                                <p className="text-xl font-bold text-slate-900">${order.totalPrice}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex flex-col gap-3">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain rounded-xl bg-slate-100"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-slate-500 text-sm">Size: {item.size} | Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-slate-900">${item.price}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

            <Link href="/" className="block text-center text-2xl font-bold text-slate-900 mt-10"> Go Back to Home </Link>
        </main>
    )
}

export default OrdersPage