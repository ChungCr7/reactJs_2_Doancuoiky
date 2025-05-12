import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

// Redux
import { setUserInfo } from "../../redux/gakeSlice";

// Import layout
import Header from "../../components/home/Header/Header";
import HeaderBottom from "../../components/home/Header/HeaderBottom";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: ""
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    try {
      const { data } = await axios.post("http://localhost:5000/api/users/register", form);

      // Lưu vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Đồng bộ Redux
      dispatch(setUserInfo(data));

      // Điều hướng về trang chủ
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong";

      if (status === 400) {
        setError({ general: message });
      } else if (status === 500) {
        navigate("/sorry");
      } else {
        setError({ general: message });
      }
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-primeColor mb-4">Create Your Account</h2>

        {error.general && <p className="text-red-500 mb-4">{error.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" className="w-full border px-4 py-2 rounded" value={form.name} onChange={handleChange} placeholder="Full Name" />
          <input name="email" className="w-full border px-4 py-2 rounded" value={form.email} onChange={handleChange} placeholder="Email Address" type="email" />
          <input name="password" className="w-full border px-4 py-2 rounded" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
          <input name="phone" className="w-full border px-4 py-2 rounded" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
          <input name="address" className="w-full border px-4 py-2 rounded" value={form.address} onChange={handleChange} placeholder="Address" />
          <input name="city" className="w-full border px-4 py-2 rounded" value={form.city} onChange={handleChange} placeholder="City" />
          <input name="country" className="w-full border px-4 py-2 rounded" value={form.country} onChange={handleChange} placeholder="Country" />
          <input name="zip" className="w-full border px-4 py-2 rounded" value={form.zip} onChange={handleChange} placeholder="ZIP Code" />

          <button type="submit" className="bg-primeColor text-white px-4 py-2 rounded hover:bg-black transition duration-300">
            Register
          </button>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <Footer />
      <FooterBottom />
    </>
  );
};

export default SignUp;
