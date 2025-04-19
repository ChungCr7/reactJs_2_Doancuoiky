const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity, image } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, name, price, quantity, image }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity, image });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};
exports.updateQuantity = async (req, res) => {
    const { quantity } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const item = cart.items.find(
        (i) => i.productId.toString() === req.params.productId
      );
      if (item) {
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update quantity", error });
    }
  };
  