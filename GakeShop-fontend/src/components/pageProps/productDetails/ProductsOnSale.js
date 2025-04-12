import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsOnSale = () => {
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        // Giả sử lấy 4 sản phẩm đầu tiên để show
        const slicedProducts = data.slice(0, 4);
        setSaleProducts(slicedProducts);
      } catch (error) {
        console.error("Failed to fetch products on sale", error);
      }
    };

    fetchSaleProducts();
  }, []);

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products on sale
      </h3>
      <div className="flex flex-col gap-2">
        {saleProducts.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
          >
            <div>
              <img
                className="w-24 h-24 object-cover"
                src={`http://localhost:5000${item.img}`}
                alt={item.productName}
              />
            </div>
            <div className="flex flex-col gap-2 font-titleFont">
              <p className="text-base font-medium">{item.productName}</p>
              <p className="text-sm font-semibold">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
