'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const CheckoutPage = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const router = useRouter()

    // Fetch items
    const fetchCart = async () => {
        const res = await fetch('/api/cart')
        const data = await res.json()

        if (data.success) {
            setItems(data.items)
        } else {
            router.push('/login')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCart()
    }, [])

    // total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Place order
    const handlePlaceOrder = async () => {
        setPlacing(true)

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        const data = await res.json()

        if (data.success) {
            Swal.fire('Success', 'Order placed successfully!', 'success')
            router.push('/orders')
        } else {
            Swal.fire('Error', data.message || 'Something went wrong', 'error')
        }

        setPlacing(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 text-lg">Loading...</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-3xl font-bold text-slate-900">Your cart is empty</h2>
                <a href="/products" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
                    Shop Now
                </a>
            </div>
        )
    }

    return (
        <main className="container mx-auto px-4 py-10">

            <h1 className="text-4xl font-bold text-slate-900 mb-10">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-10">


                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">Order Items</h2>
                    {items.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-6">

                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-contain rounded-xl bg-slate-100"
                            />

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                                <p className="text-slate-500 text-sm">Size: {item.size}</p>
                                <p className="text-slate-500 text-sm">Quantity: {item.quantity}</p>
                            </div>

                            {/* Price */}
                            <p className="text-xl font-bold text-slate-900">
                                ${item.price * item.quantity}
                            </p>

                        </div>
                    ))}
                </div>

                {/* Orders */}
                <div className="w-full lg:w-80">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mb-4">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-semibold">${total}</span>
                        </div>

                        <div className="flex justify-between mb-4">
                            <span className="text-slate-500">Shipping</span>
                            <span className="font-semibold text-green-600">Free</span>
                        </div>

                        <div className="border-t border-slate-200 pt-4 flex justify-between">
                            <span className="text-xl font-bold text-slate-900">Total</span>
                            <span className="text-xl font-bold text-slate-900">${total}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${placing
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:opacity-90 cursor-pointer'
                                }`}>
                            {placing ? 'Placing Order...' : 'Place Order'}
                        </button>

                        <a href="/cart" className="block text-center mt-4 text-slate-500 text-sm hover:underline">
                            Back to Cart
                        </a>

                    </div>
                </div>

            </div>

        </main>
    )
}

export default CheckoutPage