import React from "react";
import NavTitle from "./NavTitle";

const Price = ({ onSelectPrice }) => {
  const priceList = [
    { _id: 950, priceOne: 0.0, priceTwo: 49.99 },
    { _id: 951, priceOne: 50.0, priceTwo: 99.99 },
    { _id: 952, priceOne: 100.0, priceTwo: 199.99 },
    { _id: 953, priceOne: 200.0, priceTwo: 399.99 },
    { _id: 954, priceOne: 400.0, priceTwo: 599.99 },
    { _id: 955, priceOne: 600.0, priceTwo: 1000.0 },
    { _id: 956, priceOne: 1000.0, priceTwo: Infinity },  // ✅ Thêm dòng >1000
  ];

  const handleSelectPrice = (range) => {
    onSelectPrice(range);
  };

  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => (
            <li
              key={item._id}
              onClick={() => handleSelectPrice({ priceOne: item.priceOne, priceTwo: item.priceTwo })}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer"
            >
              {/* Nếu Infinity thì ghi là "Over $1000" */}
              {item.priceTwo === Infinity
                ? `Over $${item.priceOne}`
                : `$${item.priceOne} - $${item.priceTwo}`}
            </li>
          ))}

          {/* Reset lọc giá */}
          <li
            onClick={() => handleSelectPrice({})}
            className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 text-red-500 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer"
          >
            Xóa lọc giá
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Price;
