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

router.get('/', protect, getCart);
router.put('/:productId', protect, updateQuantity);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeItem);
router.delete('/', protect, clearCart);

module.exports = router;
