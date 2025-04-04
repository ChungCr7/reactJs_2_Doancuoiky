const express = require('express');
const router = express.Router();

// Import Controllers
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  updateUserToAdmin,
  blockUser,
} = require('../controllers/adminController');

// Import Middlewares
const { protect, admin } = require('../middleware/authMiddleware');

// ====== Admin Authentication ======
// Đăng nhập Admin
router.post('/login', adminLogin);

// ====== Admin Profile ======
// Lấy / Cập nhật profile Admin
router
  .route('/profile')
  .get(protect, admin, getAdminProfile)
  .put(protect, admin, updateAdminProfile);

// ====== User Management (For Admin) ======
// Lấy danh sách tất cả User
router.get('/users', protect, admin, getAllUsers);

// Cấp quyền Admin cho User
router.put('/users/:id/admin', protect, admin, updateUserToAdmin);

// ✅ Khóa / Mở khóa tài khoản
// ✅ Chỉ Super Admin mới được khóa Admin khác
router.put('/users/:id/block', protect, admin, blockUser);

module.exports = router;
