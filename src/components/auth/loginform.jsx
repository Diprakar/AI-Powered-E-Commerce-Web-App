"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const LoginForm = () => {
    const router = useRouter()

    // separate state for each field
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // one message for errors
    const [errorMsg, setErrorMsg] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        // basic check before calling the API
        if (!email || !password) {
            setErrorMsg("Please fill in all fields")
            return
        }

        setLoading(true)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (!result.ok) {
            setErrorMsg("Wrong email or password, try again")
        } else {
            router.push("/")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ paddingBottom: '100px' }}>
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
                    Login
                </h2>

                {errorMsg && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {errorMsg}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

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
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-sm mt-6 text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-slate-900 font-semibold">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default LoginForm