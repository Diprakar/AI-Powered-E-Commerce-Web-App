import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  weight: ["100", "200", "400", "500", "600", "800"],
  subsets: ["latin"],
})

export const metadata = {
  title: {
    default: "AI Powered E-Commerce Web App",
    template: "%s | AI Powered E-Commerce Web App",
  },
  description:
    "An AI powered e-commerce store for t-shirts and pants. Chat with our AI to find your perfect style.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}