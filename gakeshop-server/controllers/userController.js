const User = require('../models/UserDtls');
const jwt = require('jsonwebtoken');

// Tạo token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// [POST] /api/users/register - Đăng ký người dùng
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address, city, country, zip } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      country,
      zip,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      zip: user.zip,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while creating user',
      error: error.message,
    });
  }
};

// [POST] /api/users/login - Đăng nhập người dùng
exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check block
    if (user.isBlocked) {
      return res.status(403).json({
        message: 'Tài khoản của bạn đã bị khóa do vi phạm chính sách của chúng tôi.',
        isBlocked: true,
      });
    }

    // Login success
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      zip: user.zip,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// [GET] /api/users/profile - Lấy thông tin người dùng (cần token)
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Nếu user bị block => tuỳ bạn xử lý, có thể chặn luôn
  // if (user.isBlocked) {
  //   return res.status(403).json({ message: 'User is blocked' });
  // }

  res.json(user);
};

// [PUT] /api/users/profile - Cập nhật thông tin người dùng
// Hỗ trợ đổi mật khẩu an toàn với oldPassword + newPassword
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Cập nhật thông tin cơ bản
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.city = req.body.city || user.city;
  user.country = req.body.country || user.country;
  user.zip = req.body.zip || user.zip;

  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // Xử lý đổi mật khẩu an toàn
  if (oldPassword || newPassword || confirmNewPassword) {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường mật khẩu' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Mật khẩu mới không khớp nhau' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng!' });
    }

    user.password = newPassword;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    city: updatedUser.city,
    country: updatedUser.country,
    zip: updatedUser.zip,
    isAdmin: updatedUser.isAdmin,
    isBlocked: updatedUser.isBlocked,
    token: generateToken(updatedUser._id),
  });
};
