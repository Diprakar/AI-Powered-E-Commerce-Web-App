import mongoose from 'mongoose'

export const collections = {
  USERS: 'users',
  PRODUCTS: 'products',
  CART: 'carts',
  ORDERS: 'orders',
  CHAT_HISTORY: 'chatHistory',
  STOCK_REQUESTS: 'stockRequests',
}

let isConnected = false

export const dbConnect = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB connection failed:', error)
    throw error
  }
}