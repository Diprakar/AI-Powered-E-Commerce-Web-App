import Link from 'next/link'

const Footer = () => (
  <footer className="bg-[#1a1a2e] text-white mt-20">
    <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-6">

      {/* Logo */}
      <h2 className="text-2xl font-bold text-white">AI E-Commerce</h2>

      {/* Links */}
      <div className="flex gap-8">
        <Link href="/" className="text-white text-sm font-medium hover:opacity-70">Home</Link>
        <Link href="/products" className="text-white text-sm font-medium hover:opacity-70">Products</Link>
        <Link href="/cart" className="text-white text-sm font-medium hover:opacity-70">Cart</Link>
        <Link href="/orders" className="text-white text-sm font-medium hover:opacity-70">Orders</Link>
      </div>

      {/* Copyright */}
      <p className="text-gray-400 text-sm">© 2026 AI E-Commerce. All rights reserved.</p>

    </div>
  </footer>
)

export default Footer