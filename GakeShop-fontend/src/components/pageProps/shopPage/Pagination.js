import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axios from "axios";

// Hiển thị sản phẩm
function Items({ currentItems }) {
  if (!currentItems.length) {
    return (
      <div className="text-center w-full col-span-3 py-20 text-gray-500 text-xl">
        Không tìm thấy sản phẩm phù hợp.
      </div>
    );
  }

  return (
    <>
      {currentItems.map((item) => (
        <div key={item._id} className="w-full">
          <Product
            _id={item._id}
            img={`http://localhost:5000${item.img}`}
            productName={item.productName}
            price={item.price}
            color={item.color}
            badge={item.badge}
            des={item.des}
            category={item.category}
            Brand={item.Brand}
          />
        </div>
      ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, selectedCategory, selectedColor, selectedBrand, selectedPrice }) => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/products");
        setAllItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = allItems;

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedColor) {
      filtered = filtered.filter(
        (item) => item.color?.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (item) => item.Brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedPrice && selectedPrice.priceOne !== undefined && selectedPrice.priceTwo !== undefined) {
      filtered = filtered.filter(
        (item) => item.price >= selectedPrice.priceOne && item.price <= selectedPrice.priceTwo
      );
    }

    setFilteredItems(filtered);
    setItemOffset(0); // ✅ Reset về trang đầu tiên mỗi lần filter
  }, [selectedCategory, selectedColor, selectedBrand, selectedPrice, allItems]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredItems.length;
    setItemOffset(newOffset);
    setItemStart(newOffset + 1); // ✅ Sửa itemStart +1
  };

  return (
    <div>
      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 text-xl">Đang tải sản phẩm...</div>
      ) : (
        <>
          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
            <Items currentItems={currentItems} />
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
              <ReactPaginate
                nextLabel=""
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel=""
                pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
                pageClassName="mr-6"
                containerClassName="flex text-base font-semibold font-titleFont py-10"
                activeClassName="bg-black text-white"
              />
              <p className="text-base font-normal text-lightText">
                Products from {itemStart} to {Math.min(endOffset, filteredItems.length)} of {filteredItems.length}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pagination;
