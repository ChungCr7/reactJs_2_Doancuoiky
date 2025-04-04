import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaListUl,
  FaTable,
  FaBoxOpen,
  FaUserPlus,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

// 👉 Import layout
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";
import HeaderAdmin from "../../components/admin/HeaderAdmin";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const options = [
    {
      label: "Thêm Sản Phẩm",
      icon: <FaPlus className="text-4xl text-[#d89c4c]" />,
      path: "/admin/add-product",
    },
    {
      label: "Thêm Loại Sản Phẩm",
      icon: <FaListUl className="text-4xl text-[#d89c4c]" />,
      path: "/admin/add-category",
    },
    {
      label: "Xem Sản Phẩm",
      icon: <FaTable className="text-4xl text-[#d89c4c]" />,
      path: "/admin/products",
    },
    {
      label: "Quản Lý Đơn Hàng",
      icon: <FaBoxOpen className="text-4xl text-[#d89c4c]" />,
      path: "/admin/orders",
    },
    {
      label: "Quản Lý Người Dùng",
      icon: <FaUsers className="text-4xl text-[#d89c4c]" />,
      path: "/admin/users",
    },
    {
      label: "Thêm Admin",
      icon: <FaUserPlus className="text-4xl text-[#d89c4c]" />,
      path: "/admin/add-admin",
    },
    {
      label: "Admin",
      icon: <FaUserShield className="text-4xl text-[#d89c4c]" />,
      path: "/admin/admin-manager",
    },
  ];

  return (
    <>
      <HeaderAdmin  />

      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#33475b]">
          Trang Quản Trị
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white w-full h-[100px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-md hover:shadow-xl transition duration-200 cursor-pointer"
            >
              <div className="flex justify-center items-center">
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <FooterBottom />
    </>
  );
};

export default AdminDashboard;
