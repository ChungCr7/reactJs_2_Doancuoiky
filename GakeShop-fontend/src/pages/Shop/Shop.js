import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ Lọc theo Category
  const [selectedColor, setSelectedColor] = useState("");       // ✅ Lọc theo Color
  const [selectedBrand, setSelectedBrand] = useState("");       // ✅ Lọc theo Brand

  const itemsPerPageFromBanner = (items) => {
    setItemsPerPage(items);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        
        {/* Sidebar */}
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav 
            onSelectCategory={setSelectedCategory} 
            onSelectColor={setSelectedColor} 
            onSelectBrand={setSelectedBrand}   // ✅ TRUYỀN THÊM BRAND
          />
        </div>

        {/* Products */}
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <Pagination 
            itemsPerPage={itemsPerPage} 
            selectedCategory={selectedCategory}
            selectedColor={selectedColor}
            selectedBrand={selectedBrand}     // ✅ TRUYỀN selectedBrand
          />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
