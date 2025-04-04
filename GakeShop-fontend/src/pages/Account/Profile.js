import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // sửa lại từ JSON.parse luôn để tránh lỗi ban đầu

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    password: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) {
      navigate("/signin");
    } else {
      setUserInfo(storedUser);
      setForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || "",
        city: storedUser.city || "",
        country: storedUser.country || "",
        zip: storedUser.zip || "",
        password: ""
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put("http://localhost:5000/api/users/profile", form, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data); // cập nhật local state
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (!userInfo) return null; // chặn render khi chưa có userInfo

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-primeColor mb-4">Your Profile</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input name="name" className="w-full border px-4 py-2 rounded" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <input name="email" className="w-full border px-4 py-2 rounded" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
        <input name="phone" className="w-full border px-4 py-2 rounded" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        <input name="address" className="w-full border px-4 py-2 rounded" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" className="w-full border px-4 py-2 rounded" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="country" className="w-full border px-4 py-2 rounded" value={form.country} onChange={handleChange} placeholder="Country" />
        <input name="zip" className="w-full border px-4 py-2 rounded" value={form.zip} onChange={handleChange} placeholder="Zip Code" />
        <input name="password" className="w-full border px-4 py-2 rounded" value={form.password} onChange={handleChange} placeholder="New Password (optional)" type="password" />

        <button type="submit" className="bg-primeColor text-white px-4 py-2 rounded hover:bg-black transition duration-300">
          Update Profile
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
