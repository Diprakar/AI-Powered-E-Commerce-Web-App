import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String },
      category: { type: String },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    }
  ]
}, { timestamps: true })

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)

export default Cart