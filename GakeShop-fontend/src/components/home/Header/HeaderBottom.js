import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paginationItems } from "../../../constants";
import axios from "axios";
import { logout } from "../../../redux/gakeSlice";

const HeaderBottom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.gakeReducer.userInfo);
  const products = useSelector((state) => state.gakeReducer.products);

  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [setShowSearchBar] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(logout()); // ❌ KHÔNG gọi persistor.purge()
    setShowUser(false);
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!userInfo || !userInfo.token) {
      alert("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* ==== CATEGORY MENU ==== */}
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-16 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="text-gray-400 px-4 py-1 border-b border-b-gray-400 hover:border-b-white hover:text-white cursor-pointer"
                  >
                    {cat.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* ==== SEARCH ==== */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(
                        `/product/${item.productName.toLowerCase().split(" ").join("")}`,
                        { state: { item } }
                      );
                      setShowSearchBar(true);
                      setSearchQuery("");
                    }}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.img} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.productName}</p>
                      <p className="text-xs">{item.des}</p>
                      <p className="text-sm">
                        Price:{" "}
                        <span className="text-primeColor font-semibold">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==== USER & CART ==== */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-2 text-primeColor font-medium"
            >
              <FaUser className="text-[18px]" />
              <span className="text-[14px] hidden sm:inline">
                {userInfo ? userInfo.name : "Tài Khoản"}
              </span>
              <FaCaretDown className="text-[14px]" />
            </div>

            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {!userInfo ? (
                  <>
                    <Link to="/login">
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white cursor-pointer">
                        Login
                      </li>
                    </Link>
                    <Link to="/signup" onClick={() => setShowUser(false)}>
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white cursor-pointer">
                        Sign Up
                      </li>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setShowUser(false)}>
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white cursor-pointer">
                        Profile
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="text-red-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white cursor-pointer"
                    >
                      Logout
                    </li>
                  </>
                )}
              </motion.ul>
            )}

            <div onClick={handleCartClick} className="relative">
              <FaShoppingCart />
              <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                {products.length}
              </span>
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
