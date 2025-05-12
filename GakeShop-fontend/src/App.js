import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
  Navigate,
} from "react-router-dom";
// import { useSelector } from "react-redux";

// Layout
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";

// Pages
import About from "./pages/About/About";
import Login from "./pages/Account/Login";
import SignUp from "./pages/Account/SignUp";
import SorryPage from "./pages/Account/SorryPage";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import Profile from "./pages/Account/Profile";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddCategory from "./pages/Admin/AddCategory";
import AddProduct from "./pages/Admin/AddProduct";
import ProductList from "./pages/Admin/ProductList";
import OrderManager from "./pages/Admin/OrderManager";
import UserManager from "./pages/Admin/UserManager";
import AddAdmin from "./pages/Admin/AddAdmin";
import AdminManager from "./pages/Admin/AdminManager";

// Routes
import PrivateRoute from "./routes/PrivateRoute";

function Layout() {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
}

// ✅ Admin Route vẫn dùng localStorage
function AdminRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/" />;
}

// Router structure
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* PUBLIC LAYOUT */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/product/:_id" element={<ProductDetails />} />

        {/* PROTECTED ROUTES (login required) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/paymentgateway"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* AUTH ROUTES */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sorry" element={<SorryPage />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-category"
        element={
          <AdminRoute>
            <AddCategory />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ProductList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <OrderManager />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserManager />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-admin"
        element={
          <AdminRoute>
            <AddAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/admin-manager"
        element={
          <AdminRoute>
            <AdminManager />
          </AdminRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
