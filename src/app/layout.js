import { Poppins } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NextAuthProvider from "@/components/nextAuthProvider"

const poppins = Poppins({
  weight: ["100", "200", "400", "500", "600", "800"],
  subsets: ["latin"],
})

export const metadata = {
  title: "AI Powered E-Commerce Web App",
  description: "An AI powered e-commerce web app store for t-shirts and pants. Chat with our AI to find your style."
}

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <body className={`${poppins.className} antialiased`}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </NextAuthProvider>
  )
}