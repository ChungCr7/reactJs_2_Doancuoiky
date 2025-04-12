import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onSelectCategory, onSelectColor, onSelectBrand, onSelectPrice }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Bộ lọc theo Category */}
      <Category onSelectCategory={onSelectCategory} />
      
      {/* Bộ lọc theo Color */}
      <Color onSelectColor={onSelectColor} />
      
      {/* Bộ lọc theo Brand */}
      <Brand onSelectBrand={onSelectBrand} />
      
      {/* Bộ lọc theo Price */}
      <Price onSelectPrice={onSelectPrice} />
    </div>
  );
};

export default ShopSideNav;
