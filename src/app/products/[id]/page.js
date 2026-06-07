'use client'

import { useState } from 'react'
import { Product } from '@/data/products'
import { useParams } from 'next/navigation'

const ProductDetails = () => {

    const params = useParams()
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
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition cursor-pointer ${selectedSize === size
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'border-slate-300 hover:bg-slate-900 hover:text-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
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