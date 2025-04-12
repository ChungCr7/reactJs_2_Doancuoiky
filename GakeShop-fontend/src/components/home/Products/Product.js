import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";

const Product = (props) => {
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => String(_id).toLowerCase().split(" ").join("");
  const rootId = idString(_id);

  const navigate = useNavigate();

  // ✅ Đóng gói lại dữ liệu đầy đủ để truyền sang chi tiết
  const productItem = {
    _id: props._id,
    productName: props.productName,
    img: props.img,
    price: props.price,
    color: props.color,
    badge: props.badge,
    des: props.des,
    category: props.category,
    Brand: props.Brand,
  };

  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: productItem,
      },
    });
  };

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden">
        <div>
          <Image className="w-full h-full" imgSrc={props.img} />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
              Compare
              <span><GiReturnArrow /></span>
            </li>
            <li
              onClick={() => dispatch(addToCart({
                _id: props._id,
                name: props.productName,
                quantity: 1,
                image: props.img,
                badge: props.badge,
                price: props.price,
                colors: props.color,
              }))}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Cart
              <span><FaShoppingCart /></span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg"><MdOutlineLabelImportant /></span>
            </li>
            <li className="text-[#767676] hover:text-primeColor text-sm font-normal flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
              Add to Wish List
              <span><BsSuitHeartFill /></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-80 py-6 flex flex-col gap-1 border border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">{props.productName}</h2>
          <p className="text-[#767676] text-[14px]">${props.price}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.color}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
