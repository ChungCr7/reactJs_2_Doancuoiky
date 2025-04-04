import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt2 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { logo } from "../../assets/images";
import Image from "../designLayouts/Image";
import Flex from "../designLayouts/Flex";

const adminNavItems = [
  { title: "Home", path: "/admin" },
  { title: "Add Product", path: "/admin/add-product" },
  { title: "Add Category", path: "/admin/add-category" },
  { title: "Products", path: "/admin/products" },
  { title: "Orders", path: "/admin/orders" },
  { title: "Users", path: "/admin/users" },
  { title: "Add Admin", path: "/admin/add-admin" },
  { title: "Admin", path: "/admin/admin-manager" },
];

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidenav, setSidenav] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setShowMenu(false);
      else setShowMenu(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/signin");
  };

  return (
    <div className="w-full h-20 bg-[#33475b] text-white sticky top-0 z-50">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          {/* Logo + Hello */}
          <Link to="/admin" className="flex items-center gap-4">
            <Image className="w-20 object-cover" imgSrc={logo} />
            <span className="hidden sm:inline text-sm">
              👋 Hello, {userInfo?.name || "Admin"}
            </span>
          </Link>

          {/* Desktop Menu */}
          {showMenu && (
            <motion.ul
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center gap-4"
            >
              {adminNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`text-sm hover:underline underline-offset-4 px-3 py-1 ${
                    location.pathname === item.path
                      ? "text-yellow-300 font-semibold"
                      : "text-white"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-500 text-sm flex items-center gap-1"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </motion.ul>
          )}

          {/* Mobile menu icon */}
          <HiMenuAlt2
            onClick={() => setSidenav(true)}
            className="inline-block md:hidden cursor-pointer w-8 h-6"
          />

          {/* Sidenav */}
          {sidenav && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-80 text-white z-50">
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[80%] h-full bg-[#33475b] p-6 relative"
              >
                <Image className="w-24 mb-6" imgSrc={logo} />
                <ul className="flex flex-col gap-4">
                  {adminNavItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        to={item.path}
                        className={`block text-sm ${
                          location.pathname === item.path
                            ? "text-yellow-300 font-semibold"
                            : "text-white"
                        }`}
                        onClick={() => setSidenav(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  <li
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-500 cursor-pointer text-sm mt-2 flex items-center gap-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </li>
                </ul>

                <span
                  onClick={() => setSidenav(false)}
                  className="absolute top-4 -right-10 bg-white text-black p-2 rounded-full hover:bg-red-500 hover:text-white duration-300 cursor-pointer"
                >
                  <MdClose />
                </span>
              </motion.div>
            </div>
          )}
        </Flex>
      </nav>
    </div>
  );
};

export default HeaderAdmin;
