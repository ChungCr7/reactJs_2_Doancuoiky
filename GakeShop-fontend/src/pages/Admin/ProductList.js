import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pagination
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filtered.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo"))?.token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleSearch = () => {
    const result = products.filter((p) =>
      p.productName.toLowerCase().includes(keyword.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(keyword.toLowerCase()))
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1400px] mx-auto mt-10">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-black hover:underline">
          <FaArrowLeft className="mr-1" /> Quay Lại
        </button>
        <input
          type="text"
          placeholder="Nhập Từ Khóa Tìm Kiếm"
          className="border px-4 py-2 rounded w-80"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-[#e2b275] text-white px-6 py-2 rounded hover:bg-[#c79850]"
        >
          Tìm Kiếm
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">STT</th>
            <th className="p-2">Hình Ảnh</th>
            <th className="p-2">Tên Sản Phẩm</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Danh Mục</th> {/* 🆕 */}
            <th className="p-2">Badge</th>
            <th className="p-2">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item, index) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{firstIndex + index + 1}</td>
              <td className="p-2">
                <img
                  src={`http://localhost:5000${item.img}`}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="p-2">{item.productName}</td>
              <td className="p-2">{item.price.toLocaleString()} đ</td>
              <td className="p-2">{item.category || "-"}</td> {/* 🆕 */}
              <td className="p-2">{item.badge ? "✔️" : "❌"}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/add-product?id=${item._id}`)}
                  className="bg-[#e2b275] px-3 py-1 rounded text-white flex items-center gap-1"
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white flex items-center gap-1"
                >
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-2 hover:bg-gray-200"
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-2 hover:bg-gray-200"
          >
            &raquo;
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Tổng Số Sản Phẩm: {filtered.length}
      </p>
    </div>
  );
};

export default ProductList;
