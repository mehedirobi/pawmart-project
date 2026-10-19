
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdClose,
  MdLocationOn,
  MdOutlineCalendarMonth,
  MdOutlineLocalShipping,
  MdOutlineShoppingBag,
  MdPets,
} from "react-icons/md";
import toast from "react-hot-toast";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

const LABEL_CLASS =
  "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300";

function getTodayDate() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function getProductPrice(listing) {
  const price = Number(listing?.price);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getCustomerName(user) {
  return (
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    ""
  );
}

function isValidPhone(phone) {
  // Supports digits, spaces, +, parentheses and hyphens.
  // The hyphen is placed at the end to avoid character-class ambiguity.
  return /^[0-9+()\s-]{7,20}$/.test(phone) &&
    phone.replace(/\D/g, "").length >= 7;
}

async function readApiResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function OrderModal({ listing, user, onClose }) {
  const isPet = listing?.category?.toLowerCase() === "pet";
  const productPrice = getProductPrice(listing);

  const [formData, setFormData] = useState({
    quantity: "1",
    address: "",
    date: "",
    phone: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, submitting]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    if (!listing?._id || !listing?.name) {
      toast.error("Product information is unavailable.");
      return;
    }

    if (!user?.email) {
      toast.error("Please sign in before placing an order.");
      return;
    }

    const quantity = Number(formData.quantity);
    const address = formData.address.trim();
    const phone = formData.phone.trim();
    const notes = formData.notes.trim();
    const date = formData.date;

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      toast.error("Quantity must be between 1 and 99.");
      return;
    }

    if (isPet && quantity !== 1) {
      toast.error("Only one pet can be ordered at a time.");
      return;
    }

    if (address.length < 5) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Enter a valid phone number with at least 7 digits.");
      return;
    }

    if (!date || date < getTodayDate()) {
      toast.error("Please select today or a future date.");
      return;
    }

    const orderPayload = {
      name: getCustomerName(user),
      email: user.email,
      productId: listing._id,
      productName: listing.name,
      quantity,
      price: productPrice,
      address,
      date,
      phone,
      notes,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        console.error("Order API error:", {
          status: response.status,
          response: data,
        });

        throw new Error(
          data.message ||
            data.error ||
            `Order failed (HTTP ${response.status}). Please try again.`
        );
      }

      // A successful HTTP response is the primary success signal.
      // Do not require insertedId unless your backend contract guarantees it.
      toast.success("Order placed successfully!", {
        duration: 3500,
      });

      onClose?.();
    } catch (error) {
      console.error("Order submission failed:", error);

      toast.error(
        error instanceof TypeError
          ? "Cannot connect to the server. Check your API URL and backend."
          : error.message || "Unable to place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!listing) return null;

  const quantity = Math.max(0, Number(formData.quantity) || 0);
  const totalPrice = productPrice * quantity;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-3 py-5 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20 dark:border-slate-800 dark:bg-slate-950 sm:rounded-3xl"
      >
        <div className="relative overflow-hidden bg-indigo-600 px-5 py-6 text-white dark:bg-indigo-700 sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/10" />

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close order form"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 sm:right-5 sm:top-5"
          >
            <MdClose className="text-2xl" aria-hidden="true" />
          </button>

          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              {isPet ? (
                <MdPets className="text-2xl" aria-hidden="true" />
              ) : (
                <MdOutlineShoppingBag
                  className="text-2xl"
                  aria-hidden="true"
                />
              )}
            </span>

            <div className="min-w-0 pr-8">
              <h2
                id="order-modal-title"
                className="text-xl font-bold tracking-tight sm:text-2xl"
              >
                Place Your Order
              </h2>
              <p className="mt-1 text-sm text-indigo-100">
                Review your item and provide your details.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-7"
        >
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {isPet ? "Pet details" : "Selected product"}
                </p>

                <h3 className="mt-1 break-words text-base font-bold text-slate-900 dark:text-white">
                  {listing.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {isPet ? "Pet listing" : listing.category || "Product"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unit price
                </p>
                <p className="mt-1 text-lg font-extrabold text-indigo-700 dark:text-indigo-300">
                  ৳{productPrice.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-3 dark:border-indigo-500/20">
              <label
                htmlFor="order-quantity"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Quantity
              </label>

              <input
                id="order-quantity"
                name="quantity"
                type="number"
                min="1"
                max={isPet ? 1 : 99}
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                readOnly={isPet}
                required
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 read-only:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:read-only:bg-slate-800"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Estimated total
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                ৳{totalPrice.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
              Customer information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="order-name" className={LABEL_CLASS}>
                  Full name
                </label>
                <input
                  id="order-name"
                  type="text"
                  value={getCustomerName(user)}
                  readOnly
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="order-email" className={LABEL_CLASS}>
                  Email address
                </label>
                <input
                  id="order-email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
              Delivery information
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="order-address" className={LABEL_CLASS}>
                  <span className="inline-flex items-center gap-1.5">
                    <MdLocationOn
                      className="text-base text-indigo-500"
                      aria-hidden="true"
                    />
                    Delivery address
                  </span>
                </label>

                <textarea
                  id="order-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House, road, area, city..."
                  rows={2}
                  minLength={5}
                  maxLength={300}
                  autoComplete="street-address"
                  required
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="order-phone" className={LABEL_CLASS}>
                    Phone number
                  </label>
                  <input
                    id="order-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    title="Enter a valid phone number."
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="order-date" className={LABEL_CLASS}>
                    <span className="inline-flex items-center gap-1.5">
                      <MdOutlineCalendarMonth
                        className="text-base text-indigo-500"
                        aria-hidden="true"
                      />
                      Preferred date
                    </span>
                  </label>

                  <input
                    id="order-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="order-notes" className={LABEL_CLASS}>
                  Additional notes
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="order-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special delivery instructions?"
                  rows={2}
                  maxLength={1000}
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-offset-slate-950"
            >
              <MdOutlineLocalShipping
                className="text-xl"
                aria-hidden="true"
              />
              {submitting ? "Placing order..." : "Confirm Order"}
            </button>
          </div>

          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            {submitting
              ? "Submitting your order. Please wait..."
              : "Your order details will be submitted for processing."}
          </p>
        </form>
      </section>
    </div>,
    document.body
  );
}

export default OrderModal;
