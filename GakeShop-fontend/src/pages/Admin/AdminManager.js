import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";
import { useNavigate } from "react-router-dom"; // ✅ Thêm import useNavigate

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Dùng để quay lại
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const currentAdmin = JSON.parse(localStorage.getItem("userInfo"));

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminUsers = data.filter((user) => user.isAdmin);
      setAdmins(adminUsers);
    } catch (err) {
      setError("Không thể tải danh sách Admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  const handleBlock = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${id}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Cập nhật trạng thái thành công");
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  const isSuperAdmin = admins.length > 0 && currentAdmin?._id === admins[0]._id;

  return (
    <>
      <HeaderAdmin />
      <div className="container mx-auto mt-10">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)} // ✅ Quay lại trang trước
            className="px-4 py-2 bg-[#d89c4c] text-white rounded hover:bg-[#c07f2f] transition"
          >
            Quay Lại
          </button>
          <h2 className="text-center text-2xl font-semibold flex-1">Quản Lý Admin</h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="px-4 py-2 border">STT</th>
                <th className="px-4 py-2 border">Tên</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Số Điện Thoại</th>
                <th className="px-4 py-2 border">Địa Chỉ</th>
                {isSuperAdmin && <th className="px-4 py-2 border text-center">Hành Động</th>}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={admin._id} className="text-sm">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{admin.name}</td>
                  <td className="px-4 py-2 border">{admin.email}</td>
                  <td className="px-4 py-2 border">{admin.phone || "-"}</td>
                  <td className="px-4 py-2 border">
                    {[admin.address, admin.city, admin.country].filter(Boolean).join(", ")}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-2 border text-center">
                      {admin._id !== currentAdmin._id ? (
                        <button
                          onClick={() => handleBlock(admin._id)}
                          className={`px-4 py-2 text-white rounded ${
                            admin.isBlocked
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {admin.isBlocked ? "Kích Hoạt" : "Khóa"}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Super Admin</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default AdminManager;
