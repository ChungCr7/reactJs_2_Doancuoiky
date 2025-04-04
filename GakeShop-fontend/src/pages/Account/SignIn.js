import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Layout
import Header from "../../components/home/Header/Header";
import HeaderBottom from "../../components/home/Header/HeaderBottom";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", general: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "", general: "" });

    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Check nếu tài khoản bị khóa
      if (data.isBlocked) {
        return setError({
          general: "Tài khoản của bạn đã bị khóa do vi phạm chính sách. Vui lòng liên hệ bộ phận hỗ trợ.",
        });
      }

      // Lưu vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Điều hướng theo vai trò
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

      if (status === 400 || status === 401) {
        setError({
          email: message.toLowerCase().includes("email") ? message : "",
          password: message.toLowerCase().includes("password") ? message : "",
          general: !(message.toLowerCase().includes("email") || message.toLowerCase().includes("password")) ? message : "",
        });
      } else if (status === 403) {
        setError({ general: "Tài khoản đã bị khóa." });
      } else if (status === 500) {
        navigate("/sorry"); // Điều hướng ra trang lỗi riêng
      } else {
        setError({ general: message });
      }
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />

      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-primeColor mb-4 text-center">Đăng Nhập</h2>

        {error.general && <p className="text-center text-red-500 mb-4">{error.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Địa chỉ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border px-4 py-2 rounded ${error.email ? "border-red-500" : ""}`}
              required
            />
            {error.email && <p className="text-sm text-red-500">{error.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border px-4 py-2 rounded ${error.password ? "border-red-500" : ""}`}
              required
            />
            {error.password && <p className="text-sm text-red-500">{error.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primeColor text-white py-2 rounded hover:bg-black transition duration-300"
          >
            {`Đăng Nhập`}
          </button>

          <p className="text-sm text-center">
            Bạn chưa có tài khoản?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Đăng Ký
            </Link>
          </p>
        </form>
      </div>

      <Footer />
      <FooterBottom />
    </>
  );
};

export default SignIn;
