import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/gakeSlice";
import axios from "axios";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.gakeReducer.userInfo);

  const updateQuantity = async (newQty) => {
    try {
      await axios.put(
        "http://localhost:5000/api/cart",
        { productId: item.productId, quantity: newQty },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/item/${item.productId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch(deleteItem({ productId: item.productId }));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const imageSrc = item.image
    ? `http://localhost:5000${item.image}` // Đã có `/uploads/...` trong DB
    : "/no-image.png"; // fallback nếu không có ảnh

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={handleDelete}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img
          className="w-32 h-32 object-cover"
          src={imageSrc}
          alt="productImage"
          onError={(e) => {
            e.target.src = "/no-image.png";
          }}
        />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price}
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={() => {
              if (item.quantity > 1) {
                dispatch(drecreaseQuantity({ productId: item.productId }));
                updateQuantity(item.quantity - 1);
              } else {
                handleDelete();
              }
            }}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300"
          >
            -
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={() => {
              dispatch(increaseQuantity({ productId: item.productId }));
              updateQuantity(item.quantity + 1);
            }}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300"
          >
            +
          </span>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>${item.quantity * item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
