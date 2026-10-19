
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSend,
  MdPets,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";

const CONTACT_INFO = [
  {
    icon: MdEmail,
    title: "Email Us",
    value: "pawmart@gmail.com",
    href: "mailto:pawmart@gmail.com",
  },
  {
    icon: MdPhone,
    title: "Call Us",
    value: "01336-458100",
    href: "tel:01336458100",
  },
  {
    icon: MdLocationOn,
    title: "Our Location",
    value: "Dhaka, Bangladesh",
    href: null,
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      // Connect your contact API or email service here.
      // Example endpoint: `${import.meta.env.VITE_API_URL}/contact`
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error(
          "Contact form is not connected yet. Please email us directly at pawmart@gmail.com."
        );
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send your message. Please try again."
        );
      }

      setStatus("success");
      setFeedback(
        data.message || "Your message has been sent successfully."
      );
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error.message || "Something went wrong. Please try again later."
      );
    }
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-base-200 text-neutral dark:bg-neutral dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Page heading */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <MdPets size={34} aria-hidden="true" />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            We are here to help
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Contact <span className="text-indigo-600 dark:text-indigo-400">Us</span>
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Have a question about pet adoption, an order, or our services?
            Send us a message and we will help you find the right direction.
          </p>
        </motion.header>

        {/* Contact content */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          {/* Contact details */}
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
            className="flex flex-col rounded-3xl bg-indigo-600 p-6 text-white sm:p-8 lg:p-9"
          >
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Get in touch
              </h2>

              <p className="mt-3 leading-7 text-indigo-100">
                We welcome your questions, suggestions, and feedback. Contact
                PawMart using any of the details below.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;

                const content = (
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 break-words text-sm leading-6 text-indigo-100">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    className="block rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.title}>{content}</div>
                );
              })}
            </div>

            <div className="mt-auto pt-10">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                <MdPets size={25} className="mb-3" aria-hidden="true" />
                <h3 className="font-bold">Every paw matters.</h3>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Thank you for being part of a community that cares about pets
                  and their well-being.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Contact form */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.45,
              delay: shouldReduceMotion ? 0 : 0.08,
            }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8 lg:p-10"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Send us a message
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Complete the form below with your details.
            </p>

            {status === "success" && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                <MdCheckCircle size={21} className="mt-0.5 shrink-0" />
                <p>{feedback}</p>
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                <MdErrorOutline size={21} className="mt-0.5 shrink-0" />
                <p>{feedback}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Full name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Email address <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Subject <span className="text-red-500">*</span>
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Your message <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={3000}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {form.message.length}/3000
                </p>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-44"
              >
                {status === "loading" ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <MdSend size={19} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Prefer email?{" "}
              <a
                href="mailto:pawmart@gmail.com"
                className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
              >
                Contact us directly
              </a>
              .
            </p>
          </motion.section>
        </div>

        {/* Back to shopping */}
        <div className="mt-10 text-center">
          <Link
            to="/pets&Supplies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <MdPets size={18} aria-hidden="true" />
            Explore Pets & Supplies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
