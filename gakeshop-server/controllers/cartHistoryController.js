const CartHistory = require('../models/CartHistory'); // ✅ Phải import model

exports.getCartHistory = async (req, res) => {
  try {
    const history = await CartHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử giỏ hàng", error: err.message });
  }
};
