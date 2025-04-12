import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import axios from "axios";

const Brand = ({ onSelectBrand }) => {
  const [showBrands, setShowBrands] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");

        // Lấy danh sách Brand duy nhất
        const uniqueBrands = Array.from(
          new Set(data.map((product) => product.Brand))
        ).filter(Boolean); // loại undefined, null

        // Chuyển thành mảng để render
        const brandList = uniqueBrands.map((brand, index) => ({
          _id: index,
          title: brand,
        }));

        setBrands(brandList);
      } catch (error) {
        console.error("Fetch brands failed", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brand) => {
    onSelectBrand(brand);
  };

  return (
    <div>
      <div onClick={() => setShowBrands(!showBrands)} className="cursor-pointer">
        <NavTitle title="Shop by Brand" icons={true} />
      </div>

      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {brands.map((item) => (
              <li
                key={item._id}
                onClick={() => handleBrandClick(item.title)}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer hover:text-primeColor hover:border-gray-400 duration-300"
              >
                {item.title}
              </li>
            ))}

            {/* Reset Brand */}
            <li
              onClick={() => handleBrandClick("")}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 cursor-pointer hover:text-primeColor hover:border-gray-400 duration-300"
            >
              Tất cả thương hiệu
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
