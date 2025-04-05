import React, { useState, useEffect } from "react";
// import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import axios from "axios";

const Category = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

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
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map(({ _id, name }) => (
            <li
              key={_id}
              onClick={() => onSelectCategory(name)} 
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300"
            >
              {name}
            </li>
          ))}
          {/* Tùy chọn xem tất cả sản phẩm */}
          <li
            onClick={() => onSelectCategory("")}
            className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300"
          >
            Tất cả sản phẩm
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
