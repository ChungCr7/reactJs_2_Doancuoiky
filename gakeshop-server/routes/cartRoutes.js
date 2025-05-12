const express = require('express');
const {
  getCart,
  addToCart,
  removeItem,
  clearCart,
  updateQuantity,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart); // GET /api/cart
router.post('/', protect, addToCart); // POST /api/cart
router.put('/', protect, updateQuantity); // ✅ PUT /api/cart (Đã khớp)
router.delete('/item/:productId', protect, removeItem); // ✅ Dùng :productId trong URL
router.delete('/clear', protect, clearCart);

module.exports = router;
