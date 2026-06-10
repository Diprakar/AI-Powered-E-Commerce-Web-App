import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
      role: { type: String }, // user or bot
      content: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true })

const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema)

export default ChatHistory