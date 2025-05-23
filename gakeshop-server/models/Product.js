const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    badge: { type: Boolean, default: false },
    des: { type: String },
    category: { type: String, required: true },
    Brand: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
