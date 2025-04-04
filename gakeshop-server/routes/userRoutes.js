// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// ======= PUBLIC ROUTES =======
// 1. Đăng ký
router.post('/register', registerUser);

// 2. Đăng nhập
router.post('/login', authUser);

// ======= PROTECTED USER ROUTES =======
router
  .route('/profile')
  // 3. Lấy profile (GET /api/users/profile)
  .get(protect, getUserProfile)
  // 4. Cập nhật profile (PUT /api/users/profile)
  .put(protect, updateUserProfile);

module.exports = router;
