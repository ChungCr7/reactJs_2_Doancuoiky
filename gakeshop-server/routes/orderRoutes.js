const express = require('express');
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Tạo đơn hàng mới (user) - GET tất cả đơn hàng (admin)
router
  .route('/')
  .post(protect, addOrder)           // Người dùng tạo đơn hàng
  .get(protect, admin, getAllOrders); // Admin xem tất cả đơn

// Lấy danh sách đơn hàng cá nhân
router.route('/myorders').get(protect, getMyOrders);

// Lấy chi tiết đơn hàng theo ID
router.route('/:id').get(protect, getOrderById);

// ✅ Cập nhật trạng thái thanh toán
router.route('/:id/pay').put(protect, updateOrderToPaid);

// ✅ Cập nhật trạng thái giao hàng
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// ✅ Cập nhật trạng thái đơn hàng (Pending, Processing, Shipped, Delivered, Cancelled)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
