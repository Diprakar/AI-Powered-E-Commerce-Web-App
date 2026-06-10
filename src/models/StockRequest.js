import mongoose from 'mongoose'

const stockRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: { type: Number },
  productName: { type: String },
  size: { type: String },
}, { timestamps: true })

const StockRequest = mongoose.models.StockRequest || mongoose.model('StockRequest', stockRequestSchema)

export default StockRequest