const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json()); // for parsing application/json

// ====== Static Folder for Images ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== Route Imports ======
const userRoutes = require('./routes/userRoutes');             // Người dùng
const adminRoutes = require('./routes/adminRoutes');           // Quản trị viên
const productRoutes = require('./routes/productRoutes');       // Sản phẩm
const orderRoutes = require('./routes/orderRoutes');           // Đơn hàng
const categoryRoutes = require('./routes/categoryRoutes');     // Danh mục
const cartRoutes = require('./routes/cartRoutes');             // Giỏ hàng ✅
const cartHistoryRoutes = require('./routes/cartHistoryRoutes'); // Lịch sử giỏ hàng

// ====== Mount Routes ======
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes); // ✅ PHẢI nằm TRƯỚC 404
app.use('/api/cart-history', cartHistoryRoutes);

// ====== Root Route ======
app.get('/', (req, res) => {
  res.send('🌟 GakeShop API is running!');
});

// ====== 404 Middleware (PHẢI đặt sau tất cả route) ======
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ====== Global Error Handler ======
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
