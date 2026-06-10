'use client'

import { useState } from 'react'
import { Product } from '@/data/products'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'



const ProductDetails = () => {

    const params = useParams()
    const router = useRouter()
    const product = Product.find(p => p.id === Number(params.id))

    const [selectedSize, setSelectedSize] = useState('')
    const [quantity, setQuantity] = useState(1)

    if (!product) {
        return (
            <div className="text-center py-20">
                Product Not Found
            </div>
        )
    }

    const totalPrice = product.price * quantity

    const handleAddToCart = async () => {
        if (!selectedSize) return

        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                name: product.name,
                image: product.image,
                category: product.category,
                price: product.price,
                size: selectedSize,
                quantity: quantity,
            })
        })

        const data = await res.json()
        console.log('API response:', data)

        if (data.success) {
            Swal.fire('Success', 'Item added to cart!', 'success')
        } else if (data.message === 'Please login first') {
            Swal.fire({
                icon: 'warning',
                title: 'Please Login First',
                text: 'You need to login or register to add items to your cart.',
                confirmButtonText: 'Login',
                confirmButtonColor: '#1a1a2e',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login')
                }
            })
        } else {
            Swal.fire('Error', 'Something went wrong', 'error')
        }
    }


    return (
        <main className="container mx-auto px-10 py-10">

            <div className="flex items-center" style={{ gap: '150px' }}>

                {/* Left -Image */}
                <div style={{ width: '50%' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', maxHeight: '450px', objectFit: 'contain' }}
                        className="rounded-2xl bg-slate-100"
                    />
                </div>



                {/* Right Details */}
                <div style={{ width: '50%' }} className="py-4">

                    <h1 className="text-5xl font-bold">{product.name}</h1>

                    <p className="text-2xl text-slate-500 mt-4">{product.category}</p>


                    {/* Stock */}
                    {product.inStock ? (
                        <span style={{ color: 'green', fontWeight: '600' }}>
                            In Stock ({product.stock} left)
                        </span>
                    ) : (
                        <span style={{ color: 'red', fontWeight: '600' }}>
                            Out of Stock
                        </span>
                    )}



                    {/* Price */}
                    <p className="text-5xl font-bold mt-4">${totalPrice}</p>

                    {/* Sizes */}
                    <div style={{ marginTop: '30px' }}>
                        <p className="text-slate-700 font-semibold mb-3">Select Size:</p>
                        <div className="flex flex-wrap" style={{ gap: '12px' }}>
                            {product.sizes.map(size => {
                                const isAvailable = product.availableSizes.includes(size)
                                return (
                                    <button
                                        key={size}
                                        onClick={() => isAvailable && setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${!isAvailable
                                                ? 'border-slate-200 text-slate-300 cursor-not-allowed line-through'
                                                : selectedSize === size
                                                ? 'bg-slate-900 text-white border-slate-900 cursor-pointer'
                                                : 'border-slate-300 hover:bg-slate-900 hover:text-white cursor-pointer'
                                                }`}>
                                        {size}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div style={{ marginTop: '30px' }}>
                        <p className="text-slate-700 font-semibold mb-3">Quantity:</p>

                        <div className="flex items-center" style={{ gap: '16px' }}>

                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.backgroundColor = '#0f172a'; e.target.style.color = 'white'; }}
                                onMouseLeave={e => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'black'; }}>
                                -
                            </button>

                            <span className="text-xl font-semibold">{quantity}</span>

                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.backgroundColor = '#0f172a'; e.target.style.color = 'white'; }}
                                onMouseLeave={e => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'black'; }} >
                                +
                            </button>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                            className={`px-8 py-3 rounded-xl font-semibold transition ${selectedSize
                                ? 'bg-slate-900 text-white hover:opacity-90 cursor-pointer'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Add to Cart
                        </button>
                        <a
                            href="/products"
                            className="border border-slate-900 text-slate-900 px-8 py-3 rounded-xl font-semibold hover:opacity-80"
                        >
                            Go Back
                        </a>
                    </div>

                </div>

            </div>

        </main>
    )
}

export default ProductDetails