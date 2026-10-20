
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPaw,
  FaRedoAlt,
  FaTag,
} from "react-icons/fa";

const API_URL = "https://pawmart-server-peach.vercel.app";
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
});

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Free for Adoption";
  }

  const amount = Number(price);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free for Adoption";
  }

  return CURRENCY_FORMATTER.format(amount);
};

const ProductSkeleton = () => (
  <div className="mx-auto w-full max-w-5xl animate-pulse overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm">
    <div className="grid md:grid-cols-2">
      <div className="min-h-72 bg-base-300 md:min-h-[440px]" />

      <div className="space-y-5 p-6 sm:p-8">
        <div className="h-7 w-3/4 rounded bg-base-300" />
        <div className="h-5 w-1/2 rounded bg-base-300" />
        <div className="h-10 w-2/5 rounded bg-base-300" />
        <div className="h-4 w-full rounded bg-base-300" />
        <div className="h-4 w-full rounded bg-base-300" />
        <div className="h-4 w-4/5 rounded bg-base-300" />
        <div className="h-11 w-full rounded-lg bg-base-300" />
      </div>
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const loadProduct = useCallback(
    async (signal) => {
      if (!id || id === "undefined" || id === "null") {
        setProduct(null);
        setError("Invalid product ID. Please check the product link.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setProduct(null);
      setImageError(false);

      try {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`,
          { signal }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("This product could not be found.");
          }

          throw new Error(
            response.status >= 500
              ? "The server is temporarily unavailable. Please try again."
              : `Unable to load this product (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        if (
          !data ||
          typeof data !== "object" ||
          Array.isArray(data) ||
          !data.name
        ) {
          throw new Error("The product data is invalid or unavailable.");
        }

        if (!signal.aborted) {
          setProduct(data);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Failed to load product details:", err);

        if (!signal.aborted) {
          setProduct(null);
          setError(
            err instanceof TypeError
              ? "Unable to connect to the server. Check your internet connection and try again."
              : err.message || "Something went wrong while loading the product."
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProduct(controller.signal);

    return () => controller.abort();
  }, [loadProduct, retryKey]);

  const retryLoading = () => {
    setRetryKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-base-200/40 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FaArrowLeft aria-hidden="true" />
          Back to Home
        </Link>

        <header className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <FaPaw aria-hidden="true" />
            PawMart Marketplace
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
            Product Details
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Explore product information, pricing, and location.
          </p>
        </header>

        {loading && <ProductSkeleton />}

        {!loading && error && (
          <section
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-error/20 bg-base-100 px-6 py-10 text-center shadow-sm sm:px-10"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
              <FaBoxOpen size={28} aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-base-content">
              Unable to Load Product
            </h2>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              {error}
            </p>

            <button
              type="button"
              onClick={retryLoading}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <FaRedoAlt aria-hidden="true" />
              Try Again
            </button>
          </section>
        )}

        {!loading && !error && product && (
          <article className="overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-lg shadow-base-content/5">
            <div className="grid md:grid-cols-2">
              <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-base-200 sm:min-h-96 md:min-h-[480px]">
                {product.image && !imageError ? (
                  <img
                    src={product.image}
                    alt={product.name || "Product image"}
                    className="h-72 w-full object-cover sm:h-96 md:h-full md:min-h-[480px]"
                    loading="eager"
                    decoding="async"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex min-h-72 w-full flex-col items-center justify-center gap-3 text-base-content/40 sm:min-h-96 md:min-h-[480px]">
                    <FaBoxOpen size={56} aria-hidden="true" />
                    <p className="text-sm font-medium">Image unavailable</p>
                  </div>
                )}

                {product.category && (
                  <span className="absolute left-4 top-4 rounded-full bg-base-100/95 px-4 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Product information
                  </p>

                  <h2 className="mt-3 break-words text-2xl font-extrabold leading-tight text-base-content sm:text-3xl">
                    {product.name}
                  </h2>

                  <div className="mt-6 rounded-xl bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                      Price
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {product.category && (
                      <div className="flex items-start gap-3">
                        <FaTag
                          className="mt-1 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-base-content/50">
                            Category
                          </p>
                          <p className="mt-1 break-words font-semibold text-base-content">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    )}

                    {product.location && (
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt
                          className="mt-1 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-base-content/50">
                            Location
                          </p>
                          <p className="mt-1 break-words font-semibold text-base-content">
                            {product.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {product.description && (
                    <div className="mt-7 border-t border-base-200 pt-6">
                      <h3 className="text-base font-bold text-base-content">
                        Description
                      </h3>

                      <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-base-content/70">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <FaArrowLeft aria-hidden="true" />
                  Explore More Products
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default ProductDetails;
