
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPaw,
  FaSearch,
  FaMapMarkerAlt,
  FaRedoAlt,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
} from "react-icons/fa";

const API_URL = "https://pawmart-server-six.vercel.app/products";
const ITEMS_PER_PAGE = 9;

const CATEGORIES = [
  "All",
  "Pets",
  "Pet Food",
  "Accessories",
  "Pet Care Products",
];

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Free for Adoption";
  }

  const amount = Number(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free for Adoption";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
};

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm">
    <div className="h-52 animate-pulse bg-base-200 sm:h-56" />
    <div className="space-y-4 p-5">
      <div className="h-5 w-3/4 animate-pulse rounded bg-base-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-base-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-base-200" />
      <div className="h-10 animate-pulse rounded-xl bg-base-200" />
    </div>
  </div>
);

const PetsAndSupplies = () => {
  const [listings, setListings] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadListings = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();

      if (filterCategory !== "All") {
        query.set("category", filterCategory);
      }

      const url = query.size
        ? `${API_URL}?${query.toString()}`
        : API_URL;

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal,
      });

      if (!response.ok) {
        throw new Error(
          response.status === 503 || response.status === 504
            ? "The server is temporarily unavailable. Please try again."
            : `Unable to load listings (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from the server.");
      }

      setListings(data);
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("PetsAndSupplies API error:", err);
      setError(
        !navigator.onLine
          ? "You appear to be offline. Check your internet connection."
          : err.message || "Failed to load pets and supplies."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [filterCategory]);

  useEffect(() => {
    const controller = new AbortController();

    loadListings(controller.signal);

    return () => controller.abort();
  }, [loadListings, refreshKey]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return listings;

    return listings.filter((item) =>
      [
        item.name,
        item.category,
        item.location,
        item.description,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [listings, search]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  const changeCategory = (category) => {
    setFilterCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    document.getElementById("pets-listings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="min-h-screen bg-base-200/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <FaPaw />
            Find your perfect companion
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl lg:text-5xl">
            Pets & <span className="text-primary">Supplies</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-base-content/65 sm:text-base">
            Explore pets, quality pet food, accessories, and care essentials
            for your furry companions.
          </p>
        </header>

        <div className="space-y-5 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => {
              const active = filterCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => changeCategory(category)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    active
                      ? "border-primary bg-primary text-primary-content shadow-sm"
                      : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="input input-bordered flex flex-1 items-center gap-3">
              <FaSearch className="text-base-content/40" />
              <input
                type="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, category or location..."
                aria-label="Search pets and supplies"
                className="grow"
              />
            </label>

            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
              className="btn btn-outline gap-2"
            >
              <FaRedoAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div
          id="pets-listings"
          className="scroll-mt-6"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-error/20 bg-base-100 px-5 py-14 text-center shadow-sm">
              <FaExclamationCircle className="mx-auto text-3xl text-error" />
              <h2 className="mt-4 text-lg font-bold text-base-content">
                Could not load listings
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-base-content/65">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                className="btn btn-primary btn-sm mt-5 gap-2"
              >
                <FaRedoAlt />
                Try Again
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-base-200 bg-base-100 px-5 py-16 text-center">
              <FaBoxOpen className="mx-auto text-4xl text-base-content/25" />
              <h2 className="mt-4 text-lg font-bold text-base-content">
                No listings found
              </h2>
              <p className="mt-2 text-sm text-base-content/60">
                Try another category or search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  changeCategory("All");
                }}
                className="btn btn-outline btn-primary btn-sm mt-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-base-content/60">
                  Showing{" "}
                  <span className="font-bold text-base-content">
                    {paginatedListings.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-base-content">
                    {filteredListings.length}
                  </span>{" "}
                  listings
                </p>

                <p className="text-sm font-medium text-base-content/60">
                  {filterCategory}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {paginatedListings.map((item, index) => (
                  <article
                    key={item._id || item.id || `${item.name}-${index}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
                  >
                    <Link
                      to={`/listing-details/${item._id}`}
                      aria-label={`View details for ${item.name || "this listing"}`}
                      className="relative block overflow-hidden bg-base-200"
                    >
                      <img
                        src={item.image || ""}
                        alt={item.name || "Pet or pet supply"}
                        loading="lazy"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />

                      <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-base-100/95 px-3 py-1.5 text-xs font-semibold text-base-content shadow-sm backdrop-blur">
                        {item.category || "Other"}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="line-clamp-2 text-lg font-bold leading-snug text-base-content transition-colors group-hover:text-primary sm:text-xl">
                        {item.name || "Unnamed listing"}
                      </h2>

                      <div className="mt-3 flex items-center gap-2 text-sm text-base-content/60">
                        <FaMapMarkerAlt className="shrink-0 text-primary/70" />
                        <span className="truncate">
                          {item.location || "Location not specified"}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-200 pt-4">
                        <div className="min-w-0">
                          <p className="text-xs text-base-content/50">
                            {Number(item.price) > 0 ? "Price" : "Adoption"}
                          </p>
                          <p className="mt-1 break-words text-base font-extrabold text-primary">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <Link
                          to={`/listing-details/${item._id}`}
                          className="btn btn-primary btn-sm shrink-0 rounded-xl px-4"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Listings pagination"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="btn btn-outline btn-sm"
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const active = currentPage === page;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        aria-current={active ? "page" : undefined}
                        className={`btn btn-sm min-w-10 ${
                          active ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="btn btn-outline btn-sm"
                  >
                    <FaChevronRight />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PetsAndSupplies;
