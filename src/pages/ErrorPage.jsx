
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import {
  MdArrowBack,
  MdArrowForward,
  MdHome,
  MdSearchOff,
} from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";

const ErrorPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-5 py-16 text-center text-neutral dark:bg-neutral dark:text-white sm:px-8">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-500/10"
      />

      <motion.section
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 18,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
        className="relative z-10 mx-auto w-full max-w-2xl"
      >
        {/* Paw icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-100 bg-white text-indigo-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-indigo-400">
          <FaPaw
            size={34}
            aria-hidden="true"
            className={
              shouldReduceMotion
                ? ""
                : "animate-[paw-bounce_2.5s_ease-in-out_infinite]"
            }
          />
        </div>

        {/* Error code */}
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
          Error 404
        </p>

        <h1 className="mt-2 text-8xl font-black leading-none tracking-tighter text-indigo-600 dark:text-indigo-400 sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Oops! Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
          Looks like this page has wandered off. The link may be broken, or
          the page may have moved. Let’s help you find your way back to PawMart.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            <MdHome size={20} aria-hidden="true" />
            Go Back Home
          </Link>

          <Link
            to="/pets&Supplies"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
          >
            <MdSearchOff size={19} aria-hidden="true" />
            Browse Listings
            <MdArrowForward size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* Helpful link */}
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <MdArrowBack size={17} aria-hidden="true" />
            Return to the PawMart homepage
          </Link>
        </div>
      </motion.section>
    </main>
  );
};

export default ErrorPage;
