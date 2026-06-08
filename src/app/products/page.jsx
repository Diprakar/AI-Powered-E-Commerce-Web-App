import { Product } from '@/data/products'
import Link from 'next/link'

const ALLProducts = () => {
    return (
        <main className="container mx-auto px-4 py-10">

            <div className="text-center mb-12">

                <h1 className="text-5xl font-bold text-slate-900">
                    All Products
                </h1>

                <p className="text-slate-500 mt-4">
                    Discover our complete collection
                </p>

            </div>


            <div className="grid md:grid-cols-4 gap-8">
                {Product.map(product => (<Link
                    key={product.id}
                    href={`/products/${product.id}`}>

                    <div className="relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition">


                        <img
                            src={product.image}
                            className="w-40 h-52 object-contain mx-auto"
                        />

                        <h3 className="text-xl font-bold text-slate-900 mt-4">
                            {product.name}
                        </h3>

                        <p className="text-slate-500">
                            {product.category}
                        </p>

                        {product.badge && (
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                {product.badge}
                            </span>
                        )}

                        <p className="text-2xl font-bold text-slate-900 mt-3">
                            ${product.price}
                        </p>

                        <button className="mt-5 bg-slate-900 text-white px-6 py-2 rounded-lg hover:opacity-90 cursor-pointer" >
                            Add to Cart
                        </button>
                    </div>
                </Link>

                ))}
            </div>

            <div className="text-center mt-12">

                <a href="../" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90"
                > Go Back
                </a>
            </div>

        </main>
    )
}

export default ALLProducts;