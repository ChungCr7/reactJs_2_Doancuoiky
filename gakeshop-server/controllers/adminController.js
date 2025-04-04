const User = require('../models/UserDtls');
const jwt = require('jsonwebtoken');

// Hàm tạo token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// [POST] /api/admin/login - Đăng nhập Admin
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password)) && user.isAdmin) {
      if (user.isBlocked) {
        return res.status(403).json({
          message: 'Tài khoản của bạn đã bị khóa.',
          isBlocked: true,
        });
      }

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
      res.status(401).json({ message: 'Thông tin đăng nhập Admin không hợp lệ.' });
    }
  } catch (error) {
    console.error('adminLogin error:', error);
    res.status(500).json({ message: 'Server error during Admin login' });
  }
};

// [GET] /api/admin/profile - Lấy profile Admin
exports.getAdminProfile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Không có quyền Admin' });
    }

    const adminUser = await User.findById(req.user.id).select('-password');
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin không tồn tại' });
    }

    res.json(adminUser);
  } catch (error) {
    console.error('getAdminProfile error:', error);
    res.status(500).json({ message: 'Server error while getting Admin profile' });
  }
};

// [PUT] /api/admin/profile - Cập nhật thông tin + mật khẩu Admin
exports.updateAdminProfile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Không có quyền Admin' });
    }

    const adminUser = await User.findById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin không tồn tại' });
    }

    // Update thông tin
    adminUser.name = req.body.name || adminUser.name;
    adminUser.email = req.body.email || adminUser.email;
    adminUser.phone = req.body.phone || adminUser.phone;
    adminUser.address = req.body.address || adminUser.address;
    adminUser.city = req.body.city || adminUser.city;
    adminUser.country = req.body.country || adminUser.country;
    adminUser.zip = req.body.zip || adminUser.zip;

    const { oldPassword, newPassword } = req.body;

    // Nếu có yêu cầu đổi mật khẩu
    if (oldPassword && newPassword) {
      const isMatch = await adminUser.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
      }
      adminUser.password = newPassword;
    }

    const updated = await adminUser.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      city: updated.city,
      country: updated.country,
      zip: updated.zip,
      isAdmin: updated.isAdmin,
      isBlocked: updated.isBlocked,
      token: generateToken(updated._id),
    });
  } catch (error) {
    console.error('updateAdminProfile error:', error);
    res.status(500).json({ message: 'Server error while updating Admin profile' });
  }
};

// [GET] /api/admin/users - Lấy tất cả users (Admin + User)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Server error while getting users' });
  }
};

// [PUT] /api/admin/users/:id/admin - Cấp quyền Admin cho User
exports.updateUserToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    user.isAdmin = true;
    const updated = await user.save();

    res.json({ message: `${updated.name} đã được cấp quyền Admin.` });
  } catch (error) {
    console.error('updateUserToAdmin error:', error);
    res.status(500).json({ message: 'Server error while updating user to Admin' });
  }
};

// [PUT] /api/admin/users/:id/block - Khóa / Mở khóa tài khoản
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Lấy danh sách admin, sắp xếp theo thời gian tạo
    const allAdmins = await User.find({ isAdmin: true }).sort({ createdAt: 1 });
    const superAdmin = allAdmins[0]; // Người tạo đầu tiên là Super Admin

    // Nếu người bị khóa là Admin
    if (user.isAdmin) {
      // Người gọi API phải chính là Super Admin
      if (req.user._id.toString() !== superAdmin._id.toString()) {
        return res.status(403).json({ message: 'Chỉ Super Admin mới được phép khóa Admin khác' });
      }
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản',
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error('blockUser error:', error);
    res.status(500).json({ message: 'Server error while blocking user', error: error.message });
  }
};
