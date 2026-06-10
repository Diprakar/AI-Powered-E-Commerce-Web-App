'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
    const { data: session } = useSession()

    return (
        <header className="container mx-auto px-4 my-5">
            <nav className="bg-[#1a1a2e] rounded-full px-10 py-4 flex items-center justify-between relative">

                {/* Left - Nav Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-white font-medium hover:opacity-80">Home</Link>
                    <Link href="/products" className="text-white font-medium hover:opacity-80">Products</Link>
                    <Link href="/cart" className="text-white font-medium hover:opacity-80">Cart</Link>
                    <Link href="/orders" className="text-white font-medium hover:opacity-80">Orders</Link>
                </div>

                {/* Center - Logo */}
                <span className="absolute left-1/2 -translate-x-1/2 text-white text-2xl font-bold">
                    AI E-Commerce
                </span>

                {/* Right - Auth */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-white font-medium">
                                Hi, {session.user.name}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="bg-white text-[#1a1a2e] font-medium px-5 py-2 rounded-full hover:opacity-90 cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white font-medium hover:opacity-80">
                                Login
                            </Link>
                            <Link href="/register" className="bg-white text-[#1a1a2e] font-medium px-5 py-2 rounded-full hover:opacity-90">
                                Register
                            </Link>
                        </>
                    )}
                </div>

            </nav>
        </header>
    )
}

export default Navbar