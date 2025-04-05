import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo, logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";
import axios from "axios";

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const [categories, setCategories] = useState([]); // 🆕
  const location = useLocation();

  useEffect(() => {
    const ResponsiveMenu = () => {
      setShowMenu(window.innerWidth >= 667);
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
    return () => window.removeEventListener("resize", ResponsiveMenu);
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

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-50 border-b-[1px] border-b-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <Image className="w-20 object-cover" imgSrc={logo} />
          </Link>

          {/* Menu Desktop */}
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                {navBarList.map(({ _id, title, link }) => (
                  <NavLink
                    key={_id}
                    className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                    to={link}
                    state={{ data: location.pathname.split("/")[1] }}
                  >
                    <li>{title}</li>
                  </NavLink>
                ))}
              </motion.ul>
            )}

            {/* Mobile Menu */}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
            />

            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-full relative"
                >
                  <div className="w-full h-full bg-primeColor p-6">
                    <img className="w-28 mb-6" src={logoLight} alt="logoLight" />
                    <ul className="text-gray-200 flex flex-col gap-2">
                      {navBarList.map((item) => (
                        <li key={item._id}>
                          <NavLink
                            to={item.link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => setSidenav(false)}
                            className="text-gray-200 hover:underline hover:text-white"
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>

                    {/* 🆕 Accordion: Category */}
                    <div className="mt-4">
                      <h1
                        onClick={() => setCategory(!category)}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-2"
                      >
                        Shop by Category <span>{category ? "-" : "+"}</span>
                      </h1>
                      {category && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col gap-1 text-sm"
                        >
                          {categories.map((cat) => (
                            <li key={cat._id} className="headerSedenavLi">
                              {cat.name}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </div>

                    {/* Accordion: Brand (cứng) */}
                    <div className="mt-4">
                      <h1
                        onClick={() => setBrand(!brand)}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-2"
                      >
                        Shop by Brand <span>{brand ? "-" : "+"}</span>
                      </h1>
                      {brand && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col gap-1 text-sm"
                        >
                          <li className="headerSedenavLi">Apple</li>
                          <li className="headerSedenavLi">Samsung</li>
                          <li className="headerSedenavLi">Xiaomi</li>
                        </motion.ul>
                      )}
                    </div>
                  </div>

                  {/* Close Icon */}
                  <span
                    onClick={() => setSidenav(false)}
                    className="absolute top-2 -right-10 w-8 h-8 border border-gray-300 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500"
                  >
                    <MdClose />
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
