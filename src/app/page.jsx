'use client'
import { useState, useEffect } from 'react'
import { Product } from '@/data/products'

const banners = [
  {
    id: 1,
    title: 'Find Your Comfort',
    description: 'Explore your comfort with AI assistance.',
    image: '/banner/men.png'
  },
  {
    id: 2,
    title: 'Smart Shopping ',
    description: 'Explore your comfort with AI assistance.',
    image: '/banner/img-children.png'
  },
  {
    id: 3,
    title: 'Your Daily Needs',
    description: 'Explore your comfort with AI assistance.',
    image: '/banner/women.png'
  }
]


const Home = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (current >= 2) {
        setCurrent(0)
      } else {
        setCurrent(current + 1)
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [current])

  const goNext = () => {
    if (current >= 2) {
      setCurrent(0)
    } else {
      setCurrent(current + 1)
    }
  }


  const goPrev = () => {
    if (current <= 0) {
      setCurrent(2)
    } else {
      setCurrent(current - 1)
    }
  }



  return (

    <main className="container mx-auto px-4">

      <div className="text-center py-10">
        <h1 className="text-5xl font-bold text-[#1a1a2e] mb-4">
          Meet Your Digital Wardrobe Assistant
        </h1>
        <p className="text-[#1a1a2e] opacity-70 text-lg mb-8"> Finding the ultimate t-shirt and pant combination is just a message away. Just ask !!!</p>
        <div className="flex justify-center">
          <button
            onClick={() => window.dispatchEvent(new Event('openChat'))}
            className="border-2 border-[#1a1a2e] text-[#1a1a2e] px-8 py-3 rounded-full font-semibold hover:opacity-80 cursor-pointer">
            Try the Chat
          </button>
        </div>
      </div>


      <div className="relative mt-10">

        <div className="relative w-full h-[500px] text-center overflow-hidden rounded-3xl">

          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={banners[current].image}
            alt=""
            className="w-full h-full object-cover" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-20 text-center">
            <h3 className="text-2xl font-semibold md:text-4xl lg:text-6xl lg:font-extrabold w-72 lg:w-auto">
              {banners[current].title} </h3>
            <p className="mt-4 text-sm font-normal lg:text-xl lg:font-medium">
              {banners[current].description} </p>
          </div>

          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
            <button
              onClick={goPrev}
              className="w-12 h-12 rounded-full bg-white text-black text-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer" >
              ❮
            </button>
            <button
              onClick={goNext}
              className="w-12 h-12 rounded-full bg-white text-black text-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer" >
              ❯
            </button>
          </div>

        </div>
        <div className="relative z-10 -mt-16">

          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">

            <div className="grid grid-cols-4 gap-6 text-center">

              <div>
                <img
                  src="/images/1.jpg"
                  alt=""
                  className="w-24 h-24 mx-auto object-contain"
                />
                <h3 className="mt-4 font-semibold text-[#1a1a2e]">
                  Trending Styles
                </h3>
              </div>

              <div>
                <img
                  src="/images/1.jpg"
                  alt=""
                  className="w-24 h-24 mx-auto object-contain"
                />
                <h3 className="mt-4 font-semibold text-[#1a1a2e]">
                  New Arrivals
                </h3>
              </div>

              <div>
                <img
                  src="/images/1.jpg"
                  alt=""
                  className="w-24 h-24 mx-auto object-contain"
                />
                <h3 className="mt-4  font-semibold text-[#1a1a2e]">
                  Exclusive Deals

                </h3>
              </div>

              <div>
                <img
                  src="/images/1.jpg"
                  alt=""
                  className="w-24 h-24 mx-auto object-contain"
                />
                <h3 className="mt-4  font-semibold text-[#1a1a2e]">
                  Top Rated Picks
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>


      <div className="mt-28">

        <div className="text-center mb-12">

          <h2 className="text-5xl font-bold text-slate-900">
            Trending Products
          </h2>

          <p className="text-slate-500 mt-4">
            Most loved products by our customers
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-7">

          {Product.slice(0, 4).map(product => (

            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition"
            >

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

              <div style={{ marginBottom: '13px' }}>
                <p className="font-bold text-slate-900" style={{ fontSize: '24px' }}>
                  ${product.price}
                </p>


                <a
                  href={`/products/${product.id}`}
                  className="mt-3 bg-slate-900 text-white px-5 py-1 rounded-lg hover:opacity-90 cursor-pointer">
                  View
                </a>

              </div>
            </div>

          ))}

        </div>

        <div className="text-center mt-12">

          <a href="/products" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90"
          > Show More
          </a>

        </div>

      </div>

    </main >
  )
}

export default Home