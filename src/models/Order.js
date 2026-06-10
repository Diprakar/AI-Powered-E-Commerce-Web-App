import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: { type: Number },
      name: { type: String },
      image: { type: String },
      category: { type: String },
      price: { type: Number },
      size: { type: String },
      quantity: { type: Number },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'placed' },
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order