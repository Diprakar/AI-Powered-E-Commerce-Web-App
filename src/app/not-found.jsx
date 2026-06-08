import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-5">
      <h2 className="text-6xl font-bold text-slate-900">404</h2>
      <h3 className="text-2xl font-semibold text-slate-500">Page Not Found</h3>
      <Link href="/" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound