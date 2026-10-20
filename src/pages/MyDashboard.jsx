
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPaw,
  FaShoppingCart,
  FaChartLine,
  FaArrowRight,
  FaBoxOpen,
  FaWallet,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_URL = "https://pawmart-server-peach.vercel.app";

const CHART_COLORS = [
  "#4F46E5",
  "#0D9488",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
];

const NAV_ITEMS = [
  {
    label: "Overview",
    path: "/my-dashboard",
    icon: FaTachometerAlt,
    end: true,
  },
  {
    label: "My Listings",
    path: "/my-dashboard/my-listings",
    icon: FaPaw,
  },
  {
    label: "My Orders",
    path: "/my-dashboard/my-orders",
    icon: FaShoppingCart,
  },
];

const formatCurrency = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return null;
};

const getOrderName = (order) =>
  order.productName ||
  order.listingName ||
  order.itemName ||
  order.name ||
  "Product order";

const getOrderStatus = (order) =>
  order.status || order.orderStatus || "Pending";

const normalizeStatus = (status) =>
  String(status).trim().toLowerCase();

const getStatusClass = (status) => {
  const normalized = normalizeStatus(status);

  if (
    ["completed", "delivered", "paid"].includes(normalized)
  ) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }

  if (
    ["cancelled", "canceled", "rejected"].includes(normalized)
  ) {
    return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
  }

  if (
    ["processing", "shipped"].includes(normalized)
  ) {
    return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  }

  return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
};

const getOrderTimestamp = (order) => {
  const value = order.createdAt || order.orderDate || order.date;
  if (!value) return 0;

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
};

const PAGE_DETAILS = {
  "/my-dashboard": {
    eyebrow: "WORKSPACE / OVERVIEW",
    title: "Dashboard Overview",
    description: "Monitor listing prices, marketplace activity and recent orders.",
  },
  "/my-dashboard/my-listings": {
    eyebrow: "WORKSPACE / LISTINGS",
    title: "My Listings",
    description: "Manage and review your product listings.",
  },
  "/my-dashboard/my-orders": {
    eyebrow: "WORKSPACE / ORDERS",
    title: "My Orders",
    description: "Review your orders and track their current status.",
  },
};

const MyDashboard = () => {
  const location = useLocation();

  const currentPath =
    location.pathname.replace(/\/+$/, "") || "/";

  const isOverview = currentPath === "/my-dashboard";

  const pageDetails =
    PAGE_DETAILS[currentPath] || {
      eyebrow: "WORKSPACE",
      title: "Dashboard",
      description: "Manage your PawMart marketplace activity.",
    };

  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDashboardData = useCallback(async (signal) => {
    const [productsResponse, ordersResponse] = await Promise.all([
      fetch(`${API_URL}/products`, { signal }),
      fetch(`${API_URL}/orders`, { signal }),
    ]);

    if (!productsResponse.ok || !ordersResponse.ok) {
      throw new Error(
        "Unable to load dashboard data. Please try again."
      );
    }

    const [productsData, ordersData] = await Promise.all([
      productsResponse.json(),
      ordersResponse.json(),
    ]);

    const products = getArray(productsData, "products");
    const fetchedOrders = getArray(ordersData, "orders");

    if (!products || !fetchedOrders) {
      throw new Error(
        "The server returned an unexpected data format."
      );
    }

    setListings(products);
    setOrders(fetchedOrders);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        await loadDashboardData(controller.signal);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Dashboard fetch error:", err);

        setError(
          err.message ||
            "Something went wrong while loading dashboard data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [loadDashboardData, refreshKey]);

  const statistics = useMemo(() => {
    const orderValue = orders.reduce((total, order) => {
      const price = Number(order.price);

      return Number.isFinite(price) && price > 0
        ? total + price
        : total;
    }, 0);

    const pendingOrders = orders.filter(
      (order) =>
        normalizeStatus(getOrderStatus(order)) === "pending"
    ).length;

    return {
      listings: listings.length,
      orders: orders.length,
      pendingOrders,
      orderValue,
    };
  }, [listings, orders]);

  const priceChartData = useMemo(
    () =>
      listings
        .filter((item) => {
          if (
            item.price === null ||
            item.price === undefined ||
            item.price === ""
          ) {
            return false;
          }

          const price = Number(item.price);

          return Number.isFinite(price) && price >= 0;
        })
        .slice(0, 8)
        .map((item) => {
          const name = String(item.name || "Product");

          return {
            name:
              name.length > 14
                ? `${name.slice(0, 14)}…`
                : name,
            price: Number(item.price),
          };
        }),
    [listings]
  );

  const categoryData = useMemo(() => {
    const counts = listings.reduce((result, item) => {
      const category = String(
        item.category || "Uncategorized"
      ).trim();

      result[category] = (result[category] || 0) + 1;

      return result;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [listings]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            getOrderTimestamp(b) - getOrderTimestamp(a)
        )
        .slice(0, 5),
    [orders]
  );

  const navClass = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-xl px-4 py-3",
      "text-sm font-medium transition-colors duration-200",
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
    ].join(" ");

  const statCards = [
    {
      title: "Total Listings",
      value: statistics.listings.toLocaleString("en-BD"),
      description: "Products available",
      icon: FaPaw,
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300",
    },
    {
      title: "Total Orders",
      value: statistics.orders.toLocaleString("en-BD"),
      description: `${statistics.pendingOrders} pending`,
      icon: FaShoppingCart,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      title: "Order Value",
      value: formatCurrency(statistics.orderValue),
      description: "Sum of recorded order prices",
      icon: FaWallet,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    },
  ];

  const renderSkeleton = () => (
    <div
      className="space-y-6"
      aria-label="Loading dashboard"
      role="status"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <Skeleton height={18} width={120} />
            <Skeleton height={34} width={160} className="mt-3" />
            <Skeleton height={14} width={140} className="mt-3" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <Skeleton height={24} width={190} />
            <Skeleton height={260} className="mt-5" />
          </div>
        ))}
      </div>

      <span className="sr-only">
        Loading dashboard data...
      </span>
    </div>
  );

  const renderError = () => (
    <section className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">
      <FaExclamationCircle
        size={32}
        className="mx-auto text-red-500"
        aria-hidden="true"
      />

      <h2 className="mt-4 text-lg font-bold">
        Unable to load dashboard
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {error}
      </p>

      <button
        type="button"
        onClick={() => setRefreshKey((key) => key + 1)}
        className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Try again
      </button>
    </section>
  );

  const renderStatistics = () => (
    <section
      aria-label="Marketplace statistics"
      className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>

                <p className="mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon size={20} aria-hidden="true" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );

  const renderPriceChart = () => (
    <article className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold sm:text-lg">
          Listing Price Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Prices of up to 8 listings
        </p>
      </div>

      {priceChartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FaBoxOpen
              size={30}
              className="mx-auto mb-3 opacity-50"
              aria-hidden="true"
            />
            No listing price data available.
          </div>
        </div>
      ) : (
        <div
          className="h-64 w-full"
          role="img"
          aria-label="Line chart showing listing prices"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceChartData}
              margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />

              <YAxis
                width={55}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  Number(value).toLocaleString("en-BD")
                }
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Price",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  fontSize: "13px",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 3, fill: "#4F46E5" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );

  const renderCategoryChart = () => (
    <article className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold sm:text-lg">
          Category Distribution
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Listings grouped by product category
        </p>
      </div>

      {categoryData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No category data available.
        </div>
      ) : (
        <>
          <div
            className="h-56 w-full"
            role="img"
            aria-label="Pie chart showing listing categories"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((category, index) => (
                    <Cell
                      key={category.name}
                      fill={
                        CHART_COLORS[index % CHART_COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} listings`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categoryData.map((category, index) => (
              <div
                key={category.name}
                className="flex min-w-0 items-center gap-2 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      CHART_COLORS[index % CHART_COLORS.length],
                  }}
                  aria-hidden="true"
                />

                <span className="min-w-0 flex-1 truncate text-gray-600 dark:text-gray-300">
                  {category.name}
                </span>

                <span className="font-semibold">
                  {category.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );

  const renderRecentOrders = () => (
    <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-base font-bold sm:text-lg">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Latest recorded order activity
          </p>
        </div>

        <Link
          to="/my-dashboard/my-orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
        >
          View all orders
          <FaArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <FaShoppingCart
            size={30}
            className="mx-auto text-gray-300 dark:text-gray-600"
            aria-hidden="true"
          />

          <h3 className="mt-3 font-semibold">No orders yet</h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Orders will appear here when they become available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentOrders.map((order, index) => {
                const status = getOrderStatus(order);
                const amount = Number(order.price);

                return (
                  <tr
                    key={
                      order._id ||
                      order.id ||
                      order.orderId ||
                      index
                    }
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                          <FaBoxOpen size={16} aria-hidden="true" />
                        </span>

                        <div className="max-w-56">
                          <p className="truncate font-semibold">
                            {getOrderName(order)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Order #
                            {order.orderId ||
                              order._id ||
                              order.id ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(
                        order.createdAt ||
                          order.orderDate ||
                          order.date
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-semibold">
                      {Number.isFinite(amount) && amount >= 0
                        ? formatCurrency(amount)
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-gray-900 md:flex">
          <Link
            to="/"
            className="mb-10 flex items-center gap-3 px-2"
            aria-label="PawMart home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
              <FaPaw aria-hidden="true" />
            </span>

            <span>
              <span className="block text-xl font-bold tracking-tight">
                PawMart
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Marketplace dashboard
              </span>
            </span>
          </Link>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <nav
            className="flex flex-col gap-2"
            aria-label="Dashboard navigation"
          >
            {NAV_ITEMS.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={navClass}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-indigo-50 p-4 dark:bg-gray-800">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-300">
              <FaChartLine size={18} aria-hidden="true" />
            </div>

            <h2 className="text-sm font-semibold">
              Manage your shop
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
              Review your listings and keep track of order activity.
            </p>

            <Link
              to="/my-dashboard/my-listings"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
            >
              Manage listings
              <FaArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:ml-64 md:px-8 lg:px-10">
          {/* Route-aware header */}
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {pageDetails.eyebrow}
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {pageDetails.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {pageDetails.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:self-auto"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              Refresh
            </button>
          </header>

          {/* Only the Overview route displays dashboard analytics. */}
          {isOverview ? (
            loading ? (
              renderSkeleton()
            ) : error ? (
              renderError()
            ) : (
              <>
                {renderStatistics()}

                <section
                  aria-label="Marketplace analytics"
                  className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2"
                >
                  {renderPriceChart()}
                  {renderCategoryChart()}
                </section>

                {renderRecentOrders()}
              </>
            )
          ) : (
            /* Listings and Orders routes render only their own page. */
            <section className="min-w-0">
              <Outlet />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyDashboard;
