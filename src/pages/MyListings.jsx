
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPaw,
  FaSearch,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaSyncAlt,
  FaExclamationCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://pawmart-server-six.vercel.app";
const PRODUCTS_URL = `${API_URL}/products`;

const INITIAL_FORM = {
  name: "",
  category: "",
  price: "",
  location: "",
  description: "",
};

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || data.error || fallback;
  } catch {
    return fallback;
  }
};

const getPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) {
    return "Free for Adoption";
  }

  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
};

const ListingSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="h-48 bg-gray-200 dark:bg-gray-800" />
    <div className="space-y-4 p-5">
      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="flex gap-3 pt-3">
        <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  </div>
);

const MyListings = () => {
  const { user } = useContext(AuthContext);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadListings = useCallback(async (signal) => {
    if (!user?.email) {
      setListings([]);
      return;
    }

    const response = await fetch(
      `${PRODUCTS_URL}?email=${encodeURIComponent(user.email)}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to load your listings.")
      );
    }

    const data = await response.json();
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
        ? data.products
        : null;

    if (!items) {
      throw new Error("The server returned an unexpected data format.");
    }

    setListings(items);
  }, [user?.email]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        await loadListings(controller.signal);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Load listings error:", err);
        setError(err.message || "Failed to load your listings.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => controller.abort();
  }, [loadListings, refreshKey]);

  const categories = useMemo(() => {
    const values = listings
      .map((item) => String(item.category || "").trim())
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((item) => {
      const matchesSearch = [
        item.name,
        item.category,
        item.location,
        item.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [listings, search, selectedCategory]);

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      price:
        item.price === null || item.price === undefined
          ? "0"
          : String(item.price),
      location: item.location || "",
      description: item.description || "",
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingItem(null);
    setFormData(INITIAL_FORM);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDelete = async (item) => {
    if (!item?._id || deletingId || saving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name || "this listing"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item._id);

    try {
      const response = await fetch(
        `${PRODUCTS_URL}/${encodeURIComponent(item._id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to delete listing.")
        );
      }

      let result = {};

      try {
        result = await response.json();
      } catch {
        // Some APIs return an empty success response.
      }

      if (
        result.deletedCount === 0 ||
        result.acknowledged === false
      ) {
        throw new Error("The listing was not deleted.");
      }

      setListings((previous) =>
        previous.filter((listing) => listing._id !== item._id)
      );

      toast.success("Listing deleted successfully.");
    } catch (err) {
      console.error("Delete listing error:", err);
      toast.error(err.message || "Failed to delete listing.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingItem?._id || saving) return;

    const name = formData.name.trim();
    const category = formData.category.trim();
    const location = formData.location.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);

    if (!name || !category) {
      toast.error("Name and category are required.");
      return;
    }

    if (
      formData.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error("Enter a valid price of 0 or more.");
      return;
    }

    const updatedData = {
      name,
      category,
      price,
      location,
      description,
    };

    setSaving(true);

    try {
      const response = await fetch(
        `${PRODUCTS_URL}/${encodeURIComponent(editingItem._id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Failed to update listing.")
        );
      }

      setListings((previous) =>
        previous.map((item) =>
          item._id === editingItem._id
            ? { ...item, ...updatedData }
            : item
        )
      );

      setEditingItem(null);
      setFormData(INITIAL_FORM);
      toast.success("Listing updated successfully.");
    } catch (err) {
      console.error("Update listing error:", err);
      toast.error(err.message || "Failed to update listing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[60vh] text-gray-900 dark:text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px" },
        }}
      />

      {/* Listings toolbar */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                <FaPaw size={19} aria-hidden="true" />
              </span>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Your Listings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {loading
                    ? "Loading your products..."
                    : `${filteredListings.length} of ${listings.length} listings`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block min-w-0 sm:min-w-64">
              <FaSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search listings..."
                aria-label="Search listings"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
              />
            </label>

            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>

        {!loading && !error && listings.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-label="Loading listings"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900 dark:bg-gray-900">
          <FaExclamationCircle
            size={32}
            className="mx-auto text-red-500"
            aria-hidden="true"
          />

          <h3 className="mt-4 text-lg font-bold">
            Could not load listings
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FaSyncAlt aria-hidden="true" />
            Try again
          </button>
        </section>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <FaBoxOpen size={28} aria-hidden="true" />
          </span>

          <h3 className="mt-5 text-lg font-bold">
            No listings yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            You haven't added any products yet. Create a listing to
            make it available on PawMart.
          </p>

          <Link
            to="/add-product"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FaPlus aria-hidden="true" />
            Add a listing
          </Link>
        </section>
      )}

      {/* No search results */}
      {!loading &&
        !error &&
        listings.length > 0 &&
        filteredListings.length === 0 && (
          <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <FaSearch
              size={28}
              className="mx-auto text-gray-400"
              aria-hidden="true"
            />

            <h3 className="mt-4 font-bold">
              No matching listings
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try another search term or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
            >
              Clear filters
            </button>
          </section>
        )}

      {/* Listing cards */}
      {!loading && !error && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((item) => (
            <article
              key={item._id}
              className="group min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || "Listing image"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <FaPaw size={36} aria-hidden="true" />
                  </div>
                )}

                <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                  {item.category || "Uncategorized"}
                </span>
              </div>

              <div className="flex h-full flex-col p-5">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold tracking-tight">
                    {item.name || "Untitled listing"}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaMapMarkerAlt
                      className="shrink-0 text-indigo-500"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {item.location || "Location not specified"}
                    </span>
                  </p>

                  <p className="mt-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {getPrice(item.price)}
                  </p>

                  {item.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto flex gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    disabled={Boolean(deletingId) || saving}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
                  >
                    <FaEdit aria-hidden="true" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item._id || Boolean(deletingId) || saving}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    {deletingId === item._id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <FaTrash aria-hidden="true" />
                    )}
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-listing-title"
            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
              <div>
                <h2
                  id="edit-listing-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  Edit Listing
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your product information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit listing dialog"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="listing-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Product name <span className="text-red-500">*</span>
                </label>
                <input
                  id="listing-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={120}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="listing-category"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="listing-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    maxLength={80}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
                    placeholder="e.g. Pet Food"
                  />
                </div>

                <div>
                  <label
                    htmlFor="listing-price"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Price (৳)
                  </label>
                  <input
                    id="listing-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter 0 for free adoption.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="listing-location"
                  className="mb-2 block text-sm font-semibold"
                >
                  Location
                </label>
                <input
                  id="listing-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label
                  htmlFor="listing-description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="listing-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-indigo-950"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="min-h-11 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  {saving ? "Saving changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyListings;
