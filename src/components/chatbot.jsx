'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hi! How can I help you? Ask me about products, sizes, or your cart.' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const router = useRouter()

    const placeholderMsg = [
        'Hi, how can I help you?',
        'Ask me about t-shirts and pants!',
        'Want to find your perfect size?',
        'I can add items to your cart!',
        'Ask me to show products by price!',
        'Need help with checkout?',
    ]

    const [placeholderIndex, setPlaceholderIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholderMsg.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    // Listen for open event from other components
    useEffect(() => {
        const handleOpen = () => setIsOpen(prev => !prev)
        window.addEventListener('openChat', handleOpen)
        return () => window.removeEventListener('openChat', handleOpen)
    }, [])

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage = input
        setInput('')

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            })

            const data = await res.json()

            if (data.success) {
                // Add bot reply
                setMessages(prev => [...prev, { role: 'bot', content: data.reply }])

                // Show products if action is BROWSE
                if (data.action === 'BROWSE' && data.products) {
                    const productList = data.products.map(p =>
                        `• ${p.name} - $${p.price} (${p.category})`
                    ).join('\n')
                    setMessages(prev => [...prev, {
                        role: 'bot',
                        content: productList,
                        isProductList: true
                    }])
                }

                // Redirect if action is CHECKOUT
                if (data.action === 'CHECKOUT') {
                    router.push('/checkout')
                }

                // Redirect if action is VIEW_CART
                if (data.action === 'VIEW_CART') {
                    router.push('/cart')
                }

            } else {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    content: 'Sorry, something went wrong. Please try again.'
                }])
            }

        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Sorry, something went wrong. Please try again.'
            }])
        }

        setLoading(false)
    }

    // Send on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage()
    }

    return (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: 50 }}>

            {/* Chat Panel */}
            {isOpen && (
                <div className="bg-white border-t border-slate-200" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>

                    {/* Header */}
                    <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                            <span className="text-white font-semibold text-sm">AI Assistant</span>
                            <span className="text-slate-400 text-xs">Always here to help</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white text-lg cursor-pointer">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-[#1a1a2e] text-white self-end rounded-br-sm ml-auto'
                                    : 'bg-slate-100 text-slate-800 self-start rounded-bl-sm'
                                    }`}
                                style={{ whiteSpace: 'pre-wrap' }}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-slate-100 text-slate-500 text-sm px-4 py-2 rounded-2xl self-start animate-pulse">
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything — products, sizes, checkout..."
                            className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none text-slate-800" />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-[#1a1a2e] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 cursor-pointer">
                            Send
                        </button>
                    </div>

                </div>
            )}

            {/* Bottom Bar */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border-t border-slate-200 px-6 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                style={{ height: '52px' }}>
                <div className="flex items-center gap-3 flex-1">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    <span className="font-semibold text-[#1a1a2e] text-sm">AI Assistant</span>
                    <span className="text-slate-400 text-sm flex-1 text-center">{placeholderMsg[placeholderIndex]}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Online</span>
                    <span className="text-slate-400 text-sm">{isOpen ? '▼' : '▲'}</span>
                </div>
            </div>

        </div>
    )
}

export default Chatbot