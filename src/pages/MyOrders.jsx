
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";
import {
  FaBoxOpen,
  FaDownload,
  FaSearch,
  FaSyncAlt,
  FaExclamationCircle,
  FaReceipt,
} from "react-icons/fa";

const API_URL = "https://pawmart-server-six.vercel.app";
const ORDERS_URL = `${API_URL}/orders`;

const formatPrice = (price) => {
  const amount = Number(price);

  if (price === null || price === undefined || price === "") {
    return "Free";
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  const normalizedStatus = String(status || "Pending").toLowerCase();

  if (["completed", "delivered", "paid", "success"].includes(normalizedStatus)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (["cancelled", "canceled", "rejected", "failed"].includes(normalizedStatus)) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  if (["processing", "shipped", "confirmed"].includes(normalizedStatus)) {
    return "bg-blue-50 text-blue-700 ring-blue-600/20";
  }

  return "bg-amber-50 text-amber-700 ring-amber-600/20";
};

const getErrorMessage = (error) => {
  if (error?.name === "AbortError") return "";
  if (!navigator.onLine) {
    return "You appear to be offline. Check your internet connection.";
  }

  return error?.message || "Unable to load your orders. Please try again.";
};

const OrderSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="flex items-center gap-4 rounded-xl border border-base-200 p-4"
      >
        <div className="h-10 w-10 shrink-0 rounded-lg bg-base-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 rounded bg-base-200" />
          <div className="h-3 w-1/4 rounded bg-base-200" />
        </div>
        <div className="hidden h-6 w-20 rounded-full bg-base-200 sm:block" />
      </div>
    ))}
  </div>
);

const MyOrders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const userEmail = user?.email;

  const loadOrders = useCallback(async (signal) => {
    if (!userEmail) {
      setOrders([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${ORDERS_URL}?email=${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 503 || response.status === 504
            ? "The server is temporarily unavailable. Please retry."
            : `Unable to load orders (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected orders format.");
      }

      setOrders(data);
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("MyOrders fetch error:", err);
      setError(getErrorMessage(err));
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [userEmail]);

  useEffect(() => {
    const controller = new AbortController();

    loadOrders(controller.signal);

    return () => controller.abort();
  }, [loadOrders, refreshKey]);

  const availableStatuses = useMemo(() => {
    return [
      ...new Set(
        orders.map((order) => String(order.status || "Pending"))
      ),
    ].sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const productName = String(order.productName || "Unnamed product");
      const status = String(order.status || "Pending");

      const matchesSearch =
        !query ||
        productName.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        String(order._id || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrderValue = useMemo(() => {
    return orders.reduce((total, order) => {
      const price = Number(order.price);
      return total + (Number.isFinite(price) && price > 0 ? price : 0);
    }, 0);
  }, [orders]);

  const handleDownloadPDF = async () => {
    if (!filteredOrders.length) {
      toast.error("No orders available to export.");
      return;
    }

    if (downloading) return;

    setDownloading(true);

    try {
      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("My Orders Report", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Customer: ${userEmail || "N/A"}`, 14, 26);
      doc.text(`Orders: ${filteredOrders.length}`, 14, 32);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 38);

      autoTable(doc, {
        startY: 45,
        head: [["Product", "Price (BDT)", "Status", "Order Date", "Order ID"]],
        body: filteredOrders.map((order) => [
          order.productName || "Unnamed product",
          formatPrice(order.price),
          order.status || "Pending",
          formatDate(order.createdAt),
          String(order._id || "N/A"),
        ]),
        theme: "striped",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 28 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: "auto" },
        },
        margin: { left: 14, right: 14 },
      });

      doc.save("My_Orders_Report.pdf");
      toast.success("Order report downloaded.");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Could not generate the PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((key) => key + 1);
  };

  return (
    <section className="min-h-screen bg-base-100 px-4 py-8 sm:px-6 lg:px-8">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <FaReceipt />
              Order management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-base-content/60">
              Track your purchases and download your order report.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="btn btn-outline btn-sm gap-2 sm:btn-md"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={loading || downloading || filteredOrders.length === 0}
              className="btn btn-primary btn-sm gap-2 sm:btn-md"
            >
              {downloading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FaDownload />
              )}
              {downloading ? "Preparing..." : "Download Report"}
            </button>
          </div>
        </header>

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-base-content/60">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-base-content">
                    {orders.length}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FaBoxOpen size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
              <p className="text-sm text-base-content/60">Total Order Value</p>
              <p className="mt-2 text-2xl font-bold text-base-content sm:text-3xl">
                {formatPrice(totalOrderValue)}
              </p>
              <p className="mt-1 text-xs text-base-content/50">
                Calculated from the prices returned by the API
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="input input-bordered flex w-full items-center gap-2 sm:flex-1">
            <FaSearch className="shrink-0 text-base-content/40" />
            <input
              type="search"
              className="grow"
              placeholder="Search product, status or order ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search orders"
            />
          </label>

          <select
            className="select select-bordered w-full sm:w-52"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter orders by status"
          >
            <option value="all">All statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <OrderSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 px-5 py-12 text-center">
            <FaExclamationCircle className="mx-auto text-3xl text-error" />

            <h2 className="mt-4 text-lg font-semibold text-base-content">
              Could not load your orders
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-base-content/65">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="btn btn-primary btn-sm mt-5 gap-2"
            >
              <FaSyncAlt />
              Try Again
            </button>
          </div>
        ) : !orders.length ? (
          <div className="rounded-2xl border border-base-200 bg-base-100 px-5 py-16 text-center">
            <FaBoxOpen className="mx-auto text-4xl text-base-content/25" />

            <h2 className="mt-4 text-lg font-semibold text-base-content">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              Your orders will appear here after you place an order.
            </p>
          </div>
        ) : !filteredOrders.length ? (
          <div className="rounded-2xl border border-base-200 px-5 py-12 text-center">
            <p className="font-semibold text-base-content">
              No matching orders found
            </p>
            <p className="mt-2 text-sm text-base-content/60">
              Try another search term or status filter.
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-3"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-base-content/60">
              <p>
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {filteredOrders.length}
                </span>{" "}
                of {orders.length} orders
              </p>
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200/60 text-xs uppercase tracking-wide text-base-content/60">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Order Date</th>
                      <th className="px-6 py-4">Order ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order._id || `${order.productName}-${index}`}
                        className="border-t border-base-200 transition-colors hover:bg-base-200/30"
                      >
                        <td className="max-w-64 px-6 py-4">
                          <p className="truncate font-semibold text-base-content">
                            {order.productName || "Unnamed product"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 font-medium text-base-content">
                          {formatPrice(order.price)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(order.status)}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-base-content/65">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="max-w-40 px-6 py-4">
                          <span
                            className="block truncate font-mono text-xs text-base-content/55"
                            title={order._id || "N/A"}
                          >
                            {order._id || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredOrders.map((order, index) => (
                <article
                  key={order._id || `${order.productName}-${index}`}
                  className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words font-semibold text-base-content">
                        {order.productName || "Unnamed product"}
                      </h2>
                      <p className="mt-1 text-xs text-base-content/50">
                        Order #{order._id || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-base-200 pt-3">
                    <div>
                      <p className="text-xs text-base-content/50">Price</p>
                      <p className="mt-1 font-bold text-base-content">
                        {formatPrice(order.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-base-content/50">Order date</p>
                      <p className="mt-1 text-sm font-medium text-base-content">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
