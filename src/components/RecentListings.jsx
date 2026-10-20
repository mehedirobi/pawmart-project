
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowForward,
  MdLocationOn,
  MdOutlinePets,
  MdRefresh,
} from "react-icons/md";

const API_URL = "https://pawmart-server-peach.vercel.app/products/recent";

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

const FALLBACK_IMAGE =
  "https://placehold.co/600x400/f1f5f9/64748b?text=PawMart";

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free for Adoption";
  }

  return `৳${amount.toLocaleString("en-BD")}`;
}

function ListingSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-56" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-2/5 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/5 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function ListingCard({ pet }) {
  const [imageSrc, setImageSrc] = useState(
    typeof pet.image === "string" && pet.image.trim()
      ? pet.image
      : FALLBACK_IMAGE
  );

  const [imageFailed, setImageFailed] = useState(false);

  const price = Number(pet.price);
  const isFree = !Number.isFinite(price) || price <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-900/5 motion-reduce:transform-none dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:shadow-black/20">
      {/* Listing image */}
      <Link
        to={`/listing-details/${pet._id}`}
        aria-label={`View details for ${pet.name || "this listing"}`}
        className="relative block overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:bg-slate-800"
      >
        <img
          src={imageSrc}
          alt={imageFailed ? "PawMart listing placeholder" : pet.name || "Pet listing"}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (!imageFailed) {
              setImageFailed(true);
              setImageSrc(FALLBACK_IMAGE);
            }
          }}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none sm:h-56"
        />

        <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/95 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm dark:border-slate-700 dark:bg-slate-950/90 dark:text-indigo-300">
          {pet.category || "Pet"}
        </span>
      </Link>

      {/* Listing information */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
            {pet.name || "Unnamed Listing"}
          </h3>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MdLocationOn
              className="shrink-0 text-lg text-indigo-500 dark:text-indigo-400"
              aria-hidden="true"
            />
            <span className="line-clamp-1">
              {pet.location || "Location not specified"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isFree ? "Adoption" : "Listed price"}
            </span>

            <span
              className={`text-base font-extrabold ${
                isFree
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-indigo-700 dark:text-indigo-300"
              }`}
            >
              {formatPrice(pet.price)}
            </span>
          </div>
        </div>

        <Link
          to={`/listing-details/${pet._id}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:bg-indigo-800 motion-reduce:transition-none dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-offset-slate-900"
        >
          See Details
          <MdArrowForward
            className="text-lg transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, { signal });

      if (!response.ok) {
        throw new Error(
          `Unable to load listings (${response.status}). Please try again.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected response.");
      }

      setListings(
        data.filter((item) => item && item._id)
      );
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Failed to fetch recent listings:", err);
      setError(err.message || "Something went wrong while loading listings.");
      setListings([]);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchListings(controller.signal);

    return () => controller.abort();
  }, [fetchListings]);

  function handleRetry() {
    const controller = new AbortController();
    fetchListings(controller.signal);
  }

  return (
    <section
      aria-labelledby="recent-listings-title"
      className="my-16 sm:my-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-9 flex flex-col items-center text-center sm:mb-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <MdOutlinePets className="text-base" aria-hidden="true" />
            Find your companion
          </span>

          <h2
            id="recent-listings-title"
            className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white"
          >
            Recent Pet Listings
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
            Explore recently listed pets and discover your next companion.
          </p>

          <div className="mt-4 h-1 w-14 rounded-full bg-indigo-600 dark:bg-indigo-400" />
        </div>

        {/* Loading state */}
        {loading && (
          <div
            aria-label="Loading recent listings"
            aria-busy="true"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
          >
            {SKELETON_ITEMS.map((item) => (
              <ListingSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center dark:border-rose-500/20 dark:bg-rose-500/5"
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              Couldn't load recent listings
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <MdRefresh className="text-lg" aria-hidden="true" />
              Try Again
            </button>
          </div>
        )}

        {/* Listing cards */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {listings.map((pet) => (
              <ListingCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
            <MdOutlinePets
              className="mx-auto text-4xl text-slate-400"
              aria-hidden="true"
            />

            <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
              No listings available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check back soon for new pet listings.
            </p>
          </div>
        )}

        {/* View all */}
        {!loading && !error && listings.length > 0 && (
          <div className="mt-9 flex justify-center sm:mt-11">
            <Link
              to="/pets&Supplies"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition-colors hover:border-indigo-600 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-indigo-500/30 dark:bg-slate-900 dark:text-indigo-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 dark:focus-visible:ring-offset-slate-950"
            >
              Explore All Listings
              <MdArrowForward className="text-lg" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentListings;
