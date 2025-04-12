import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import axios from "axios";

const Color = ({ onSelectColor }) => {
  const [showColors, setShowColors] = useState(true);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        // Lấy danh sách màu từ sản phẩm
        const uniqueColors = Array.from(
          new Set(data.map((product) => product.color))
        ).filter(Boolean); // lọc undefined/null

        // Tạo danh sách màu cho giao diện
        const colorList = uniqueColors.map((color, index) => ({
          _id: index,
          title: color,
          base: color.toLowerCase(), // sẽ convert thành màu CSS
        }));

        setColors(colorList);
      } catch (error) {
        console.error("Fetch colors failed", error);
      }
    };

    fetchColors();
  }, []);

  const handleColorClick = (color) => {
    onSelectColor(color);
  };

  return (
    <div>
      <div
        onClick={() => setShowColors(!showColors)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Color" icons={true} />
      </div>
      {showColors && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {/* List màu từ API */}
            {colors.map((item) => (
              <li
                key={item._id}
                onClick={() => handleColorClick(item.title)}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer hover:text-primeColor duration-300"
              >
                <span
                  style={{ background: item.base }}
                  className="w-4 h-4 rounded-full border border-gray-400"
                ></span>

                {item.title}
              </li>
            ))}

            {/* Reset tất cả màu */}
            <li
              onClick={() => handleColorClick("")}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer hover:text-primeColor duration-300"
            >
              <span className="w-3 h-3 rounded-full bg-gray-300"></span>
              Tất cả màu
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;
