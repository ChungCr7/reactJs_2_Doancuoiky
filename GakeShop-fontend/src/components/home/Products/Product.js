import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCartFromServer } from "../../../redux/gakeSlice";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.gakeReducer.userInfo);

  const _id = props.productName;
  const rootId = String(_id).toLowerCase().split(" ").join("");

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
      state: { item: productItem },
    });
  };

  const handleAddToCart = async () => {
    if (!userInfo || !userInfo.token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: props._id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch(setCartFromServer(res.data.items));
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden">
        <Image className="w-full h-full" imgSrc={props.img} />
        <div className="absolute top-6 left-8">
          {props.badge && <Badge text={props.badge} />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li className="text-[#767676] hover:text-primeColor text-sm border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 cursor-pointer pb-1 duration-300 w-full">
              Compare <GiReturnArrow />
            </li>
            <li
              onClick={handleAddToCart}
              className="text-[#767676] hover:text-primeColor text-sm border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Cart <FaShoppingCart />
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm border-b border-gray-200 hover:border-primeColor flex items-center justify-end gap-2 cursor-pointer pb-1 duration-300 w-full"
            >
              View Details <MdOutlineLabelImportant />
            </li>
            <li className="text-[#767676] hover:text-primeColor text-sm flex items-center justify-end gap-2 cursor-pointer pb-1 duration-300 w-full">
              Add to Wish List <BsSuitHeartFill />
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-80 py-6 flex flex-col gap-1 border border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">{props.productName}</h2>
          <p className="text-[#767676] text-[14px]">${props.price}</p>
        </div>
        <p className="text-[#767676] text-[14px]">{props.color}</p>
      </div>
    </div>
  );
};

export default Product;
