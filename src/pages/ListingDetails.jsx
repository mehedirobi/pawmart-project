
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Tag, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import OrderModal from "../components/OrderModal";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://pawmart-server-peach.vercel.app";

const ListingDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchListing = async () => {
      setLoading(true);
      setListing(null);
      setImageError(false);

      try {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setListing(null);
            return;
          }

          throw new Error("Failed to load listing.");
        }

        const data = await response.json();

        if (!data || typeof data !== "object" || !data.name) {
          throw new Error("Invalid listing data.");
        }

        setListing(data);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Listing details error:", error);
        toast.error("Unable to load listing. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchListing();
    } else {
      setListing(null);
      setLoading(false);
    }

    return () => controller.abort();
  }, [id]);

  const handleOrder = () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    setShowModal(true);
  };

  if (loading) {
    return (
      <main className="mx-auto my-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-neutral-900 dark:ring-neutral-700"
          aria-label="Loading listing details"
          role="status"
        >
          <div className="grid gap-6 p-5 md:grid-cols-2 md:p-8">
            <div className="min-h-64 rounded-xl bg-gray-200 dark:bg-neutral-700 sm:min-h-80" />

            <div className="space-y-5 py-2">
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-neutral-700" />
              <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-neutral-700" />
              <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-neutral-700" />
              <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-neutral-700" />
              <div className="mt-8 h-12 w-full rounded-lg bg-gray-200 dark:bg-neutral-700" />
            </div>
          </div>
        </div>
        <span className="sr-only">Loading listing details...</span>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Listing not found
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          This listing may have been removed or is no longer available.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Home
        </Link>
      </main>
    );
  }

  const hasPrice =
    listing.price !== null &&
    listing.price !== undefined &&
    listing.price !== "";

  const price = Number(listing.price);
  const validPrice = hasPrice && Number.isFinite(price) && price >= 0;

  const formattedPrice =
    !validPrice || price === 0
      ? "Free for Adoption"
      : `৳${price.toLocaleString("en-BD")}`;

  return (
    <main className="mx-auto my-8 w-full max-w-6xl px-4 sm:my-12 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-gray-300 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back to listings
      </Link>

      <article className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-200 transition-shadow duration-300 hover:shadow-lg dark:bg-neutral-900 dark:ring-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center bg-gray-50 p-4 dark:bg-neutral-800 sm:p-6 md:min-h-[460px]">
            {listing.image && !imageError ? (
              <img
                src={listing.image}
                alt={listing.name}
                className="max-h-[460px] w-full rounded-xl object-contain"
                loading="eager"
                fetchPriority="high"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-xl bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-300"
                role="img"
                aria-label={`Image unavailable for ${listing.name}`}
              >
                <ShoppingBag size={40} aria-hidden="true" />
                <span className="text-sm">Image unavailable</span>
              </div>
            )}
          </div>

          <div className="flex flex-col p-5 sm:p-8 lg:p-10">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Tag size={15} aria-hidden="true" />
                {listing.category || "Uncategorized"}
              </span>
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              {listing.name}
            </h1>

            <p
              className={`mt-5 text-2xl font-bold sm:text-3xl ${
                validPrice && price > 0
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formattedPrice}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-5 dark:border-neutral-700">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Listing information
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Tag
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Category
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {listing.category || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {listing.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={handleOrder}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800"
              >
                <ShoppingBag size={19} aria-hidden="true" />
                {validPrice && price === 0 ? "Adopt Now" : "Order Now"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Review your order details before confirming.
              </p>
            </div>
          </div>
        </div>
      </article>

      {showModal && (
        <OrderModal
          listing={listing}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
};

export default ListingDetails;
