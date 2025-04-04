// productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

// Cấu hình Multer để upload ảnh (img)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Thư mục uploads/ phải có
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
  fileFilter(req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Chỉ hỗ trợ ảnh jpeg, jpg, png, gif'));
    }
  },
});

const router = express.Router();

// GET danh sách sản phẩm, POST tạo sản phẩm (cần upload)
router
  .route('/')
  .get(getProducts) // Không cần đăng nhập
  .post(protect, admin, upload.single('img'), createProduct); // Chỉ admin + upload

// GET 1 sp, PUT cập nhật, DELETE xóa
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('img'), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;