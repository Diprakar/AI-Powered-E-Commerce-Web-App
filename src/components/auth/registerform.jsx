"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const RegisterForm = () => {
    const router = useRouter()


    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMsg, setErrorMsg] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        
        if (!name || !email || !password) {
            setErrorMsg("Please fill in all fields")
            return
        }

        setLoading(true)

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (data.success) {

            await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            router.push("/")
        } else {
            setErrorMsg(data.message || "Something went wrong, try again")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ paddingBottom: '150px' }}>
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
                    Create Account
                </h2>


                {errorMsg && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {errorMsg}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>

                </form>

                <p className="text-center text-sm mt-6 text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-slate-900 font-semibold">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default RegisterForm