const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CartHistory = require('../models/CartHistory');

// ======= LẤY GIỎ HÀNG =======
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.json({ items: [] });

    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======= THÊM SẢN PHẨM VÀO GIỎ =======
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user._id });

    const newItem = {
      productId,
      productName: product.productName,
      price: product.price,
      quantity,
      image: product.img || '', // Lấy từ field 'img' trong Product model
    };

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [newItem],
      });
    } else {
      const index = cart.items.findIndex(item => item.productId.equals(productId));
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }
    }

    await cart.save();

    await CartHistory.create({
      userId: req.user._id,
      action: 'add',
      productId,
      productName: product.productName,
      quantity,
    });

    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======= CẬP NHẬT SỐ LƯỢNG =======
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await cart.save();

    await CartHistory.create({
      userId: req.user._id,
      action: 'update',
      productId,
      productName: item.productName,
      quantity,
    });

    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======= XÓA 1 SẢN PHẨM =======
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: 'Item not found' });

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();

    await CartHistory.create({
      userId: req.user._id,
      action: 'remove',
      productId,
      productName: item.productName,
      quantity: item.quantity,
    });

    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======= XÓA TOÀN BỘ GIỎ HÀNG =======
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    await CartHistory.create({
      userId: req.user._id,
      action: 'clear',
    });

    res.json({ message: 'Cart cleared', items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
