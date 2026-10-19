
import { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      await Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      // Demo only: connect a newsletter API or email service
      // here before treating the user as actually subscribed.

      await Swal.fire({
        icon: "success",
        title: "You're on the list!",
        text: `Thanks for your interest. Newsletter integration is not connected yet.`,
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Got it",
      });

      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mx-auto mt-12 max-w-7xl overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 sm:px-8 sm:py-14 lg:px-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-gray-800 dark:text-indigo-300">
          <span aria-hidden="true">🐾</span>
          PawMart Newsletter
        </span>

        <h2
          id="newsletter-heading"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl"
        >
          Get Pet Tips{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            Weekly
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
          Helpful pet-care tips, product updates, and special offers to help
          your furry friends live happier, healthier lives.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>

          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
            disabled={submitting}
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Processing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
          Useful pet-care updates, delivered to your inbox. Unsubscribe anytime
          when newsletter service is connected.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
