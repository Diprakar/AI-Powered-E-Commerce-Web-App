import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import Cart from '@/models/Cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// GET user's cart
export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please login first' },
                { status: 401 }
            )
        }

        await dbConnect()

        const cart = await Cart.findOne({ userId: session.user.id })

        return NextResponse.json({
            success: true,
            items: cart ? JSON.parse(JSON.stringify(cart.items)) : []
        })

    } catch (error) {
        console.log('Get cart error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}

// POST - add items to cart
export const POST = async (req) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please login first' },
                { status: 401 }
            )
        }

        const { productId, name, image, category, price, size, quantity } = await req.json()

        await dbConnect()

        let cart = await Cart.findOne({ userId: session.user.id })

        if (!cart) {
            cart = new Cart({ userId: session.user.id, items: [] })
        }

        const existingItem = cart.items.find(
            item => item.productId === productId && item.size === size
        )

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({ productId, name, image, category, price, size, quantity })
        }

        await cart.save()

        const updatedCart = await Cart.findOne({ userId: session.user.id })

        return NextResponse.json({
            success: true,
            message: 'Item added to cart',
            items: JSON.parse(JSON.stringify(updatedCart.items))
        })

    } catch (error) {
        console.log('Add to cart error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}

// delete items from cart
export const DELETE = async (req) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please login first' },
                { status: 401 }
            )
        }

        const { productId, size } = await req.json()

        await dbConnect()

        const cart = await Cart.findOne({ userId: session.user.id })

        if (!cart) {
            return NextResponse.json(
                { success: false, message: 'Cart not found' },
                { status: 404 }
            )
        }

        cart.items = cart.items.filter(
            item => !(item.productId === productId && item.size === size)
        )

        await cart.save()

        const updatedCart = await Cart.findOne({ userId: session.user.id })

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart',
            items: JSON.parse(JSON.stringify(updatedCart.items))
        })

    } catch (error) {
        console.log('Remove from cart error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}