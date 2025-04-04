// src/pages/Admin/OrderManager.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    const result = orders.filter((order) =>
      order._id.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleStatusChange = (orderId, value) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: value }));
  };

  const updateStatus = async (orderId) => {
    try {
      const status = statusUpdates[orderId];
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const totalPages = Math.ceil(filtered.length / ordersPerPage);
  const currentOrders = filtered.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-center text-2xl font-semibold mb-6">Tất Cả Đơn Hàng</h2>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-black hover:underline"
        >
          ← Quay Lại
        </button>
        <input
          type="text"
          placeholder="Nhập Mã Đơn Hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-[300px]"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
        >
          Tìm Kiếm
        </button>
      </div>

      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Mã Đơn Hàng</th>
            <th className="p-2 border">Thông Tin Giao Hàng</th>
            <th className="p-2 border">Ngày</th>
            <th className="p-2 border">Thông Tin Sản Phẩm</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Trạng Thái</th>
            <th className="p-2 border">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order._id} className="border-t">
              <td className="p-2 border">{order._id}</td>
              <td className="p-2 border whitespace-pre-line">
                Tên: {order.shipping.name}
                {"\n"}Email: {order.shipping.email}
                {"\n"}SĐT: {order.shipping.phone}
                {"\n"}Địa Chỉ: {order.shipping.address}
                {"\n"}Thành Phố: {order.shipping.city}
                {"\n"}Tỉnh : {order.shipping.zip}
              </td>
              <td className="p-2 border">{order.date}</td>
              <td className="p-2 border">
                {order.products.map((p, i) => (
                  <div key={i}>
                    {p.productName} - SL: {p.quantity}
                  </div>
                ))}
              </td>
              <td className="p-2 border">
                {order.products.map((p, i) => (
                  <div key={i}>
                    Giá: {p.price.toLocaleString()}
                  </div>
                ))}
                <strong>Tổng Giá: {order.total.toLocaleString()}</strong>
              </td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">
                <select
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  defaultValue=""
                  className="border px-2 py-1 rounded"
                >
                  <option disabled value="">
                    --Chọn--
                  </option>
                  <option value="In Progress">In Progress</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  onClick={() => updateStatus(order._id)}
                  className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Cập Nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          &laquo;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          &raquo;
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">Tổng Số Đơn Hàng: {filtered.length}</p>
    </div>
  );
};

export default OrderManager;
