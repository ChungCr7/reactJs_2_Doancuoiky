import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

const ProductDetails = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    if (location.state?.item) {
      setProductInfo(location.state.item);
    }
    setPrevLocation(location.pathname);
  }, [location]);

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          {/* ✅ Breadcrumbs hiện tên sản phẩm */}
          <Breadcrumbs 
            title={productInfo.productName || "Product Details"} 
            prevLocation={prevLocation} 
          />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          {/* Products On Sale - cột bên trái */}
          <div className="h-full">
            <ProductsOnSale />
          </div>

          {/* Product Image - chính giữa */}
          <div className="h-full xl:col-span-2">
            {productInfo.img ? (
              <img
                className="w-full h-full object-cover"
                src={productInfo.img}
                alt={productInfo.productName}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Product Info - bên phải */}
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
