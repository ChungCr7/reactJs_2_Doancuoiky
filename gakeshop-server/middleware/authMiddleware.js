const jwt = require('jsonwebtoken');
const User = require('../models/UserDtls');

// Middleware bảo vệ route (yêu cầu xác thực token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user dựa trên id trong token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // ❗ Chỉ block user thường (isAdmin == false)
      if (user.isBlocked && !user.isAdmin) {
        return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
      }

      // Gắn user vào req để các middleware sau dùng
      req.user = user;

      next();
    } catch (err) {
      console.error('JWT Error:', err.message);
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } else {
    return res.status(401).json({ message: 'Không có token, không được phép truy cập' });
  }
};

// Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Không đủ quyền Admin' });
  }
};

module.exports = { protect, admin };
