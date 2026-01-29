import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaPaw,
  FaShoppingCart,
  FaPlusCircle,
} from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyDashboard = () => {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
    ${
      isActive
        ? "bg-indigo-500 text-white"
        : "text-gray-700 hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-gray-700"
    }`;

  // Fetch Listings & Orders
  useEffect(() => {
    setLoading(true);
    fetch("https://pawmart-server-six.vercel.app/products")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err));

    fetch("https://pawmart-server-six.vercel.app/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Sample chart data
  const lineData = listings.map((item, index) => ({
    name: item.name.slice(0, 10),
    price: item.price || 0,
  }));

  const pieData = [
    { name: "Pets", value: listings.filter((l) => l.category === "Pets").length },
    { name: "Pet Food", value: listings.filter((l) => l.category === "Pet Food").length },
    { name: "Accessories", value: listings.filter((l) => l.category === "Accessories").length },
    { name: "Pet Care", value: listings.filter((l) => l.category === "Pet Care Products").length },
  ];

  const COLORS = ["#6366F1", "#7C3AED", "#F59E0B", "#10B981"];

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-50 dark:bg-neutral shadow-lg hidden md:flex flex-col p-6 fixed h-full">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
          PawMart
        </Link>

        <nav className="flex flex-col gap-2">
          <NavLink to="/my-dashboard" end className={navClass}>
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink to="/my-dashboard/my-listings" className={navClass}>
            <FaPaw />
            My Listings
          </NavLink>

          <NavLink to="/my-dashboard/my-orders" className={navClass}>
            <FaShoppingCart />
            My Orders
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-10">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[listings.length, orders.length, orders.reduce((acc, o) => acc + (o.price || 0), 0)].map(
            (value, index) => (
              <div key={index} className="bg-white hover:bg-indigo-50 dark:bg-gray-800 shadow-lg rounded-lg p-5">
                {loading ? (
                  <Skeleton height={30} width={150} />
                ) : index === 0 ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-300 font-medium">Total Listings</p>
                    <h3 className="text-2xl font-bold">{listings.length}</h3>
                  </>
                ) : index === 1 ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-300 font-medium">Total Orders</p>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-300 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold">
                      {orders.reduce((acc, o) => acc + (o.price || 0), 0)} Taka
                    </h3>
                  </>
                )}
              </div>
            )
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h3 className="font-bold text-lg mb-4 text-indigo-600 dark:text-indigo-400">
              Listings Price Overview
            </h3>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h3 className="font-bold text-lg mb-4 text-indigo-600 dark:text-indigo-400">
              Category Distribution
            </h3>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            )}
          </div>
        </div>

        

        <Outlet />
      </main>
    </div>
  );
};

export default MyDashboard;
