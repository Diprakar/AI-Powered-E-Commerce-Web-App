import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import StockRequest from '@/models/StockRequest'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions)
    const { productId, productName, size } = await req.json()

    await dbConnect()

    await StockRequest.create({
      userId: session ? session.user.id : null,
      productId,
      productName,
      size,
    })

    return NextResponse.json({
      success: true,
      message: 'Stock request saved'
    })

  } catch (error) {
    console.log('Stock request error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}