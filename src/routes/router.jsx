import { createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "../pages/Home";
import HomeLayout from "../layout/HomeLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import ProductDetails from "../pages/ProductDetails";
import AddListing from "../pages/AddListing";
import ListingDetails from "../pages/ListingDetails";
import MyOrders from "../pages/MyOrders";
import PetsAndSupplies from "../pages/PetsAndSupplies";
import MyListing from "../pages/MyListings";
import MyDashboard from "../pages/MyDashboard";
import AboutUs from "../pages/AboutUs";
import CategoryFilteredProduct from "../pages/CategoryFilteredProduct";
import Contact from "../pages/Contact";
import PrivateRoute from "../provider/PrivateRoute";
import MyProfile from "../pages/MyProfile";

const HomeLayoutWithToast = () => (
  <>
    <HomeLayout />

    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
    />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayoutWithToast />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "add-listing",
        element: (
          <PrivateRoute>
            <AddListing />
          </PrivateRoute>
        ),
      },
      {
        path: "my-dashboard",
        element: (
          <PrivateRoute>
            <MyDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                  My Dashboard
                </h2>
                <p className="mt-2 text-sm text-base-content/60">
                  Manage your listings and orders in one place.
                </p>
              </div>
            ),
          },
          {
            path: "my-listings",
            element: <MyListing />,
          },
          {
            path: "my-orders",
            element: <MyOrders />,
          },
        ],
      },
      {
        path: "listing-details/:id",
        element: <ListingDetails />,
      },
      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "pets&supplies",
        element: <PetsAndSupplies />,
      },
      {
        path: "my-listings",
        element: (
          <PrivateRoute>
            <MyListing />
          </PrivateRoute>
        ),
      },
      {
        path: "category-filtered-product/:categoryName",
        element: <CategoryFilteredProduct />,
      },
    ],
  },
]);

export default router;
