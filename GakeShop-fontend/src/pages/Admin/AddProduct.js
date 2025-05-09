import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    price: 0,
    color: "",
    badge: false,
    des: "",
    img: null,
    category: "",
    Brand: "", // 🆕 thêm Brand vào form
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Fetch categories failed", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "badge") {
      setForm({ ...form, badge: !form.badge });
    } else if (type === "file") {
      setForm({ ...form, img: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("price", form.price);
      formData.append("color", form.color);
      formData.append("badge", form.badge);
      formData.append("des", form.des);
      formData.append("category", form.category);
      formData.append("Brand", form.Brand); // 🆕 thêm Brand
      if (form.img) {
        formData.append("img", form.img);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, config);
        setMessage("Cập nhật sản phẩm thành công");
      } else {
        await axios.post("http://localhost:5000/api/products", formData, config);
        setMessage("Thêm sản phẩm thành công");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      setMessage("Lỗi khi lưu sản phẩm");
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setForm({
      productName: prod.productName || "",
      price: prod.price || 0,
      color: prod.color || "",
      badge: prod.badge || false,
      des: prod.des || "",
      img: null,
      category: prod.category || "",
      Brand: prod.Brand || "", // 🆕 load lại Brand
    });
  };

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      fetchProducts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const resetForm = () => {
    setForm({
      productName: "",
      price: 0,
      color: "",
      badge: false,
      des: "",
      img: null,
      category: "",
      Brand: "", // 🆕 reset Brand
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-[1300px] mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-black underline hover:text-blue-600 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Quay Lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="col-span-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4">
              {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            {message && <p className="text-green-600 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1">Tên sản phẩm</label>
                <input
                  name="productName"
                  placeholder="Nhập tên sản phẩm"
                  className="w-full border px-4 py-2 rounded"
                  value={form.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Giá</label>
                <input
                  name="price"
                  type="number"
                  className="w-full border px-4 py-2 rounded"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-1">Màu sắc</label>
                <select
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                >
                  <option value="">-- Chọn màu sắc --</option>
                  <option value="Green">Green</option>
                  <option value="Gray">Gray</option>
                  <option value="Red">Red</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Blue">Blue</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Danh mục sản phẩm</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🆕 Thêm chọn Brand */}
              <div>
                <label className="block mb-1">Thương hiệu (Brand)</label>
                <input
                  name="Brand"
                  placeholder="Nhập tên thương hiệu"
                  className="w-full border px-4 py-2 rounded"
                  value={form.Brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="badge"
                  checked={form.badge}
                  onChange={handleChange}
                />
                <span className="ml-1">Hiển thị Badge</span>
              </div>

              <div>
                <label className="block mb-1">Mô tả</label>
                <textarea
                  name="des"
                  rows="3"
                  className="w-full border px-4 py-2 rounded"
                  value={form.des}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <label className="block mb-1">Ảnh sản phẩm</label>
                <input
                  type="file"
                  name="img"
                  className="w-full border px-4 py-2 rounded"
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-1/2 bg-[#d89c4c] text-white py-2 rounded"
                >
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bảng danh sách sản phẩm */}
        <div className="col-span-2">
          <h3 className="text-2xl text-center font-semibold mb-4">
            Danh sách sản phẩm
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">Ảnh</th>
                  <th className="p-2">Tên</th>
                  <th className="p-2">Giá</th>
                  <th className="p-2">Màu sắc</th>
                  <th className="p-2">Danh mục</th>
                  <th className="p-2">Brand</th> 
                  <th className="p-2">Badge</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, i) => (
                  <tr key={prod._id} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">
                      {prod.img ? (
                        <img
                          src={`http://localhost:5000${prod.img}`}
                          alt={prod.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span>Không có ảnh</span>
                      )}
                    </td>
                    <td className="p-2">{prod.productName}</td>
                    <td className="p-2">${prod.price.toLocaleString()}</td>
                    <td className="p-2">{prod.color || "-"}</td>
                    <td className="p-2">{prod.category || "-"}</td>
                    <td className="p-2">{prod.Brand || "-"}</td> 
                    <td className="p-2">{prod.badge ? "✔" : ""}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="bg-[#d89c4c] px-3 py-1 rounded text-white flex items-center gap-1"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white flex items-center gap-1"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2">
              Tổng số sản phẩm: {products.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
