
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MdPets,
  MdLocationOn,
  MdRefresh,
  MdSearchOff,
  MdArrowForward,
  MdErrorOutline,
} from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";

const API_URL = "https://pawmart-server-peach.vercel.app/products";
const FALLBACK_IMAGE =
  "https://placehold.co/600x400/f1f5f9/64748b?text=PawMart";

const formatPrice = (price, category) => {
  if (category === "Pets") return "Free for Adoption";

  const amount = Number(price);

  if (!Number.isFinite(amount) || amount < 0) {
    return "Price unavailable";
  }

  if (amount === 0) return "Free";

  return `৳${amount.toLocaleString("en-BD")}`;
};

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
    <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-4 p-5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

const ProductCard = ({ item, index, shouldReduceMotion }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const price = formatPrice(item.price, item.category);
  const isPet = item.category === "Pets";

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.2),
      }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/40 dark:hover:shadow-black/20"
    >
      <Link
        to={`/listing-details/${item._id}`}
        aria-label={`View details for ${item.name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:bg-slate-800"
      >
        <img
          src={imageFailed || !item.image ? FALLBACK_IMAGE : item.image}
          alt={item.name || "PawMart listing"}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/95 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm dark:border-white/10 dark:bg-slate-950/90 dark:text-indigo-300">
          {item.category || "Other"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900 dark:text-white">
          {item.name || "Untitled listing"}
        </h2>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MdLocationOn
            size={18}
            className="shrink-0 text-indigo-500"
            aria-hidden="true"
          />
          <span className="truncate">{item.location || "Location not provided"}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p
            className={`text-base font-extrabold ${
              isPet
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {price}
          </p>

          <Link
            to={`/listing-details/${item._id}`}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            Details
            <MdArrowForward size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const CategoryFilteredProduct = () => {
  const { categoryName = "" } = useParams();
  const shouldReduceMotion = useReducedMotion();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedCategory = decodeURIComponent(categoryName)
    .replace(/\+/g, " ")
    .trim();

  const fetchProducts = useCallback(
    async (signal) => {
      if (!normalizedCategory) {
        setProducts([]);
        setError("A product category was not specified.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const url = new URL(API_URL);
        url.searchParams.set("category", normalizedCategory);

        const response = await fetch(url.toString(), { signal });

        if (!response.ok) {
          throw new Error("Unable to load listings. Please try again.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from the server.");
        }

        setProducts(data.filter((item) => item && item._id));
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Failed to fetch category listings:", err);
        setError(err.message || "Something went wrong while loading listings.");
        setProducts([]);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [normalizedCategory]
  );

  useEffect(() => {
    const previousTitle = document.title;
    const controller = new AbortController();

    document.title = `${normalizedCategory || "Category"} Listings | PawMart`;

    fetchProducts(controller.signal);

    return () => {
      controller.abort();
      document.title = previousTitle;
    };
  }, [fetchProducts, normalizedCategory]);

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10 text-neutral dark:bg-neutral sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-9 text-center sm:mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <MdPets size={30} aria-hidden="true" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Explore PawMart
          </p>

          <h1 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {normalizedCategory || "Category"} Listings
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Browse available listings and find the right pet or product for
            your needs.
          </p>

          {!loading && !error && (
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              {products.length} {products.length === 1 ? "listing" : "listings"} found
            </p>
          )}
        </header>

        {/* Loading state */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Loading listings"
            aria-busy="true"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <section
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-500/30 dark:bg-slate-900"
          >
            <MdErrorOutline
              size={42}
              className="mx-auto text-red-500"
              aria-hidden="true"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Could not load listings
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                const controller = new AbortController();
                fetchProducts(controller.signal);
              }}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
            >
              <MdRefresh size={19} aria-hidden="true" />
              Try Again
            </button>
          </section>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900 sm:py-16">
            <MdSearchOff
              size={48}
              className="mx-auto text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No listings found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              There are no listings in this category right now. Check back
              later or explore other categories.
            </p>

            <Link
              to="/pets&Supplies"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
            >
              Browse all listings
              <MdArrowForward size={18} aria-hidden="true" />
            </Link>
          </section>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item, index) => (
              <ProductCard
                key={item._id}
                item={item}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        )}

        {/* Footer link */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/pets&Supplies"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Browse all Pets & Supplies
              <MdArrowForward size={18} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryFilteredProduct;
