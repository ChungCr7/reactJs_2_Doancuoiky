import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  products: [],
};

export const gakeSlice = createSlice({
  name: "gake",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setCartFromServer: (state, action) => {
      state.products = action.payload;
    },
    addToCart: (state, action) => {
      const item = state.products.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const index = state.products.findIndex(
        (i) => i.productId === action.payload.productId
      );
      if (index !== -1) {
        if (state.products[index].quantity > 1) {
          state.products[index].quantity--;
        } else {
          // Nếu chỉ còn 1 và giảm nữa thì xóa khỏi giỏ
          state.products.splice(index, 1);
        }
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.productId !== action.payload.productId
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    logout: (state) => {
      state.userInfo = null;
      state.products = []; // frontend chỉ reset, backend vẫn giữ
      // ❗ Không xóa products, để giỏ hàng vẫn giữ nguyên sau đăng nhập lại
    },
  },
});

export const {
  setUserInfo,
  setCartFromServer,
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  logout,
} = gakeSlice.actions;

export default gakeSlice.reducer;
