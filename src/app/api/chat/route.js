import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import ChatHistory from '@/models/ChatHistory'
import Cart from '@/models/Cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { Product } from '@/data/products'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const POST = async (req) => {
    try {
        const session = await getServerSession(authOptions)
        const { message } = await req.json()

        await dbConnect()

        let cartItems = []
        if (session) {
            const cart = await Cart.findOne({ userId: session.user.id })
            if (cart) cartItems = JSON.parse(JSON.stringify(cart.items))
        }

        let chatHistory = []
        if (session) {
            const history = await ChatHistory.findOne({ userId: session.user.id })
            if (history) chatHistory = history.messages.slice(-20)
        }

        const conversationHistory = chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))

        const systemPrompt = `You are a helpful AI shopping assistant for an e-commerce store that sells t-shirts and pants.

Available products:
${JSON.stringify(Product.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            sizes: p.sizes,
            availableSizes: p.availableSizes,
            inStock: p.inStock,
            badge: p.badge
        })))}

User's current cart:
${cartItems.length > 0 ? JSON.stringify(cartItems) : 'Cart is empty'}

Always respond with a JSON object in this exact format:
{
  "action": "BROWSE" | "ADD_TO_CART" | "REMOVE_FROM_CART" | "VIEW_CART" | "CHECKOUT" | "STOCK_REQUEST" | "CHAT",
  "products": [...] or null,
  "productId": number or null,
  "productName": string or null,
  "size": string or null,
  "quantity": number or null,
  "reply": "your friendly message to the user"
}

Rules:
- For BROWSE: return matching products array. Keep reply very short like "Here are the matching products:" nothing more.
- For ADD_TO_CART: return productId, productName, size, quantity
- For REMOVE_FROM_CART: return productId, size
- For CHECKOUT: just set action to CHECKOUT
- For VIEW_CART: just set action to VIEW_CART
- For STOCK_REQUEST: when user asks for unavailable size, create stock request and notify user
- For CHAT: general conversation
- Always be helpful and friendly
- If user says "add the second one", use context from previous messages`

        // Call Groq API
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory,
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024,
        })

        const responseText = completion.choices[0]?.message?.content || ''

        let parsedResponse
        try {
            const cleanText = responseText.replace(/```json|```/g, '').trim()
            parsedResponse = JSON.parse(cleanText)
        } catch {
            parsedResponse = {
                action: 'CHAT',
                reply: responseText,
                products: null
            }
        }

        if (parsedResponse.action === 'ADD_TO_CART' && session) {
            const product = Product.find(p => p.id === parsedResponse.productId)
            if (product && parsedResponse.size) {
                let cart = await Cart.findOne({ userId: session.user.id })
                if (!cart) {
                    cart = new Cart({ userId: session.user.id, items: [] })
                }
                const existingItem = cart.items.find(
                    item => item.productId === product.id && item.size === parsedResponse.size
                )
                if (existingItem) {
                    existingItem.quantity += parsedResponse.quantity || 1
                } else {
                    cart.items.push({
                        productId: product.id,
                        name: product.name,
                        image: product.image,
                        category: product.category,
                        price: product.price,
                        size: parsedResponse.size,
                        quantity: parsedResponse.quantity || 1,
                    })
                }
                await cart.save()
            }
        }

        if (parsedResponse.action === 'REMOVE_FROM_CART' && session) {
            const cart = await Cart.findOne({ userId: session.user.id })
            if (cart) {
                cart.items = cart.items.filter(
                    item => !(item.productId === parsedResponse.productId && item.size === parsedResponse.size)
                )
                await cart.save()
            }
        }

        if (parsedResponse.action === 'STOCK_REQUEST') {
            await fetch(`${process.env.NEXTAUTH_URL}/api/stock-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: parsedResponse.productId,
                    productName: parsedResponse.productName,
                    size: parsedResponse.size,
                })
            })
        }

        if (session) {
            let history = await ChatHistory.findOne({ userId: session.user.id })
            if (!history) {
                history = new ChatHistory({ userId: session.user.id, messages: [] })
            }
            history.messages.push({ role: 'user', content: message })
            history.messages.push({ role: 'bot', content: parsedResponse.reply })
            await history.save()
        }

        return NextResponse.json({
            success: true,
            action: parsedResponse.action,
            reply: parsedResponse.reply,
            products: parsedResponse.products || null,
        })

    } catch (error) {
        console.log('Chat error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}