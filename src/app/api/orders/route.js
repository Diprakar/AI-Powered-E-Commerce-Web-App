import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import Order from '@/models/Order'
import Cart from '@/models/Cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'


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

        const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            orders: JSON.parse(JSON.stringify(orders))
        })

    } catch (error) {
        console.log('Get orders error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}

// place order
export const POST = async () => {
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

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Cart is empty' },
                { status: 400 }
            )
        }

        // total price
        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        )

        // new order
        await Order.create({
            userId: session.user.id,
            items: cart.items,
            totalPrice,
            status: 'placed',
        })

        // Clear the cart after order
        cart.items = []
        await cart.save()

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
        })

    } catch (error) {
        console.log('Place order error:', error)
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        )
    }
}