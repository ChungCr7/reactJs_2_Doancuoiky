import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onSelectCategory }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category onSelectCategory={onSelectCategory} />
      <Color />
      <Brand />
      <Price />
    </div>
  );
};

export default ShopSideNav;
