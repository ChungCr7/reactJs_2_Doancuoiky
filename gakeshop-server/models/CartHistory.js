const mongoose = require("mongoose");

const cartHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String, // 'add', 'update', 'remove', 'clear'
    enum: ['add', 'update', 'remove', 'clear'],
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: String,
  quantity: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CartHistory", cartHistorySchema);
