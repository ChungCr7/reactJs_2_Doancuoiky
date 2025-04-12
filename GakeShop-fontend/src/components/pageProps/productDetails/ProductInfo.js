import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">${productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>

      {/* 👉 Thêm Brand */}
      <p className="font-medium text-lg">
        <span className="font-normal">Brand:</span> {productInfo.Brand}
      </p>

      <p className="font-medium text-lg">
        <span className="font-normal">Color:</span> {productInfo.color}
      </p>

      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo._id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
              brand: productInfo.Brand,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>

      <p className="font-normal text-sm">
        <span className="text-base font-medium">Category:</span>{" "}
        {productInfo.category}
      </p>
    </div>
  );
};

export default ProductInfo;
