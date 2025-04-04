// controllers/productController.js

const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// 1) Lấy tất cả sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get products', error });
  }
};

// 2) Lấy chi tiết 1 sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get product', error });
  }
};

// 3) Tạo sản phẩm mới (admin)
exports.createProduct = async (req, res) => {
  try {
    const { productName, price, color, badge, des } = req.body;

    // Nếu có file upload
    let imgPath = '';
    if (req.file) {
      imgPath = `/uploads/${req.file.filename}`;
    }

    const product = new Product({
      productName,
      img: imgPath, // Lưu đường dẫn ảnh
      price,
      color,
      // Ép kiểu boolean nếu frontend gửi "true"/"false"
      badge: badge === 'true' || badge === true,
      des
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// 4) Cập nhật sản phẩm (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { productName, price, color, badge, des } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Nếu upload file ảnh mới
    if (req.file) {
      // Xoá ảnh cũ nếu có
      if (product.img) {
        const oldImgPath = path.join(__dirname, '..', product.img);
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
      product.img = `/uploads/${req.file.filename}`;
    }

    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.color = color || product.color;
    // Ép kiểu boolean nếu cần
    product.badge = badge === 'true' || badge === true;
    product.des = des || product.des;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// 5) Xoá sản phẩm (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Xoá ảnh trên ổ cứng nếu có
    if (product.img) {
      const oldImgPath = path.join(__dirname, '..', product.img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
