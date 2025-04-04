// src/pages/Admin/AddAdmin.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Tạo user mới
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
          zip: form.zip,
        },
        config
      );

      // Gán quyền admin cho user đó
      await axios.put(
        `http://localhost:5000/api/admin/users/${data._id}/admin`,
        {},
        config
      );

      setMessage("Tạo tài khoản Admin thành công!");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        zip: "",
      });
    } catch (err) {
      console.error("Lỗi khi tạo admin:", err);
      setError(err.response?.data?.message || "Đã có lỗi xảy ra.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-md rounded">
      {/* Nút Quay lại */}
      <div
        className="mb-4 flex items-center gap-2 text-[#d89c4c] cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> <span className="underline">Quay Lại</span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">Thêm Admin</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Tên", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Mật khẩu", name: "password", type: "password" },
          { label: "Xác nhận mật khẩu", name: "confirmPassword", type: "password" },
          { label: "Số điện thoại", name: "phone", type: "text" },
          { label: "Địa chỉ", name: "address", type: "text" },
          { label: "Thành phố", name: "city", type: "text" },
          { label: "Quốc gia", name: "country", type: "text" },
          { label: "Mã bưu chính (Zip)", name: "zip", type: "text" },
        ].map((input) => (
          <div key={input.name}>
            <label className="block mb-1">{input.label}</label>
            <input
              type={input.type}
              name={input.name}
              value={form[input.name]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder={input.label}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-[#d89c4c] text-white py-2 rounded hover:bg-[#c48a38] transition duration-300"
        >
          Thêm Admin
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
