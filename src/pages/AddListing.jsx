
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  MdPets,
  MdAddPhotoAlternate,
  MdLocationOn,
  MdCalendarMonth,
  MdArrowBack,
  MdCheckCircle,
  MdInfoOutline,
} from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://pawmart-server-peach.vercel.app/products";

const CATEGORIES = [
  { value: "Pets", label: "Pets & Adoption" },
  { value: "Food", label: "Pet Food" },
  { value: "Accessories", label: "Accessories" },
  { value: "Care Products", label: "Care Products" },
];

const INITIAL_FORM = {
  name: "",
  category: "Pets",
  price: "",
  location: "",
  description: "",
  image: "",
  date: "",
  email: "",
};

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400";

const labelClasses =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

const AddListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    email: user?.email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isPet = formData.category === "Pets";

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      email: user?.email || "",
    }));
  }, [user?.email]);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [formData.image]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "category" && value === "Pets" ? { price: "" } : {}),
    }));
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM,
      email: user?.email || "",
    });
    setImageError(false);
    setImageLoaded(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!user?.email) {
      toast.error("Please log in before adding a listing.");
      return;
    }

    const name = formData.name.trim();
    const location = formData.location.trim();
    const description = formData.description.trim();
    const image = formData.image.trim();

    if (!name || !location || !description || !image || !formData.date) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (description.length < 10) {
      toast.error("Description must contain at least 10 characters.");
      return;
    }

    try {
      new URL(image);
      if (!/^https?:$/.test(new URL(image).protocol)) {
        throw new Error("Invalid image URL");
      }
    } catch {
      toast.error("Please enter a valid image URL starting with https:// or http://.");
      return;
    }

    let price = 0;

    if (!isPet) {
      if (formData.price === "" || !Number.isFinite(Number(formData.price))) {
        toast.error("Please enter a valid price.");
        return;
      }

      price = Number(formData.price);

      if (price < 0 || price > 100000000) {
        toast.error("Enter a price between ৳0 and ৳100,000,000.");
        return;
      }
    }

    const payload = {
      name,
      category: formData.category,
      price: isPet ? 0 : price,
      location,
      description,
      image,
      date: formData.date,
      email: user.email,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.insertedId) {
        throw new Error(
          data.message || "Unable to add your listing. Please try again."
        );
      }

      toast.success("Listing added successfully!");
      resetForm();

      // Change this route if your project uses another listing page.
      navigate("/pets&Supplies");
    } catch (error) {
      console.error("Add listing error:", error);
      toast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 text-neutral dark:bg-neutral dark:text-white sm:px-6 sm:py-14">
      <Toaster position="top-center" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        className="mx-auto max-w-5xl"
      >
        {/* Back navigation */}
        <Link
          to="/pets&Supplies"
          className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400"
        >
          <MdArrowBack size={19} aria-hidden="true" />
          Back to Pets & Supplies
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          {/* Header */}
          <div className="border-b border-slate-200/80 px-6 py-7 dark:border-white/10 sm:px-9 sm:py-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <MdPets size={27} aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                  PawMart Marketplace
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Add a New Listing
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  Share a pet or list a product for the PawMart community.
                  Complete the details below to create your listing.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
              {/* Form fields */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="listing-name" className={labelClasses}>
                    Listing name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="listing-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Persian Cat or Premium Pet Food"
                    className={inputClasses}
                    minLength={2}
                    maxLength={100}
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="listing-category" className={labelClasses}>
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="listing-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="listing-price" className={labelClasses}>
                    Price (BDT)
                    {!isPet && <span className="text-red-500"> *</span>}
                  </label>

                  {isPet ? (
                    <div className="flex min-h-12 items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 text-sm text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                      <MdInfoOutline size={20} aria-hidden="true" />
                      <span>
                        Pet listings are set to ৳0 in the current setup.
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        ৳
                      </span>
                      <input
                        id="listing-price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                        max="100000000"
                        step="1"
                        className={`${inputClasses} pl-9`}
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="listing-location" className={labelClasses}>
                    <span className="inline-flex items-center gap-1.5">
                      <MdLocationOn size={18} aria-hidden="true" />
                      Location <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <input
                    id="listing-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Dhanmondi, Dhaka"
                    className={inputClasses}
                    maxLength={150}
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="listing-date" className={labelClasses}>
                    <span className="inline-flex items-center gap-1.5">
                      <MdCalendarMonth size={18} aria-hidden="true" />
                      Listing date <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <input
                    id="listing-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="listing-description" className={labelClasses}>
                    Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="listing-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the pet or product, its condition, features, or other important details..."
                    className={`${inputClasses} min-h-36 resize-y leading-6`}
                    minLength={10}
                    maxLength={3000}
                    required
                  />

                  <p className="mt-1.5 text-right text-xs text-slate-400">
                    {formData.description.length}/3000
                  </p>
                </div>

                <div>
                  <label htmlFor="listing-image" className={labelClasses}>
                    <span className="inline-flex items-center gap-1.5">
                      <MdAddPhotoAlternate size={19} aria-hidden="true" />
                      Image URL <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <input
                    id="listing-image"
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={inputClasses}
                    maxLength={2048}
                    required
                  />

                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Paste a direct URL to an image that you have permission to
                    use.
                  </p>
                </div>

                <div>
                  <label htmlFor="listing-email" className={labelClasses}>
                    Listing owner email
                  </label>

                  <input
                    id="listing-email"
                    type="email"
                    value={user?.email || ""}
                    className={inputClasses}
                    readOnly
                    aria-describedby="listing-email-note"
                  />

                  <p
                    id="listing-email-note"
                    className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
                  >
                    This email comes from your current signed-in account.
                  </p>
                </div>
              </div>

              {/* Preview panel */}
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-800/60">
                  <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Listing Preview
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Preview updates as you fill out the form.
                    </p>
                  </div>

                  <div className="aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {formData.image && !imageError ? (
                      <img
                        src={formData.image}
                        alt={formData.name || "Listing preview"}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                          setImageError(true);
                          setImageLoaded(false);
                        }}
                        className={`h-full w-full object-cover transition-opacity duration-200 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                        <MdAddPhotoAlternate size={45} aria-hidden="true" />
                        <span className="px-4 text-center text-sm">
                          {imageError
                            ? "Could not load this image"
                            : "Your image preview will appear here"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="break-words font-bold text-slate-900 dark:text-white">
                        {formData.name.trim() || "Your listing name"}
                      </h3>

                      <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                        {formData.category}
                      </span>
                    </div>

                    <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <MdLocationOn size={18} aria-hidden="true" />
                      <span className="break-words">
                        {formData.location.trim() || "Your location"}
                      </span>
                    </p>

                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {isPet
                        ? "৳0"
                        : formData.price !== "" &&
                            Number.isFinite(Number(formData.price)) &&
                            Number(formData.price) >= 0
                          ? `৳${Number(formData.price).toLocaleString("en-BD")}`
                          : "Price not set"}
                    </p>

                    <p className="break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {formData.description.trim() ||
                        "Your listing description will appear here."}
                    </p>

                    {formData.date && (
                      <p className="border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                        Listing date: {formData.date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-400/20 dark:bg-indigo-500/10">
                  <MdCheckCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  <p className="text-xs leading-5 text-indigo-800 dark:text-indigo-200">
                    Make sure your listing details are accurate and your image
                    clearly represents the pet or product.
                  </p>
                </div>
              </aside>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !user?.email}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Adding Listing...
                  </>
                ) : (
                  <>
                    <MdPets size={19} aria-hidden="true" />
                    Add Listing
                  </>
                )}
              </button>
            </div>

            {!user?.email && (
              <p className="mt-4 text-right text-sm text-red-600 dark:text-red-400">
                Please{" "}
                <Link to="/login" className="font-bold underline">
                  log in
                </Link>{" "}
                to add a listing.
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddListing;
