import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const normalUsers = data.filter((user) => !user.isAdmin); // ❗ bỏ admin
      setUsers(normalUsers);
      setFiltered(normalUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Không thể tải danh sách người dùng.");
      console.error("Lỗi lấy danh sách user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    const keyword = search.toLowerCase().trim();
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(keyword)
    );
    setFiltered(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleBlockUser = async (userId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái người dùng:", error);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto bg-white shadow-md rounded-md">
      {/* Quay lại */}
      <div
        className="mb-4 flex items-center gap-2 text-[#d89c4c] cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> <span className="underline">Quay Lại</span>
      </div>

      <h2 className="text-2xl text-center font-semibold mb-6">
        Quản Lý Người Dùng
      </h2>

      {/* Tìm kiếm */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Nhập tên cần tìm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border px-4 py-2 rounded w-[300px]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#e0ae74] px-6 py-2 rounded text-white hover:bg-[#c8923d]"
        >
          Tìm Kiếm
        </button>
      </div>

      {/* Thông báo lỗi */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Bảng người dùng */}
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">STT</th>
                <th className="p-2">Tên</th>
                <th className="p-2">Email</th>
                <th className="p-2">Số ĐT</th>
                <th className="p-2">Địa Chỉ</th>
                <th className="p-2">Quyền</th>
                <th className="p-2">Trạng Thái</th>
                <th className="p-2">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone || "-"}</td>
                  <td className="p-2">
                    {[user.address, user.city, user.country, user.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="p-2">
                    {user.isAdmin ? "Admin" : "Người Dùng"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        user.isBlocked
                          ? "bg-red-200 text-red-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Đã Khóa" : "Đang Hoạt Động"}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleBlockUser(user._id)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked ? "Kích Hoạt" : "Khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-sm text-gray-500 mt-3">
            Tổng số người dùng: {filtered.length}
          </p>
        </>
      )}
    </div>
  );
};

export default UserManager;
