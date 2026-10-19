
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAdd,
  MdRemove,
  MdHelpOutline,
  MdArrowForward,
  MdPets,
} from "react-icons/md";
import { motion, useReducedMotion } from "motion/react";

const FAQ_DATA = [
  {
    question: "How do I add a pet or product listing on PawMart?",
    answer:
      "Create an account and sign in to PawMart. Open Add Listing, provide the name, category, price where applicable, location, description, image URL, and listing date, then submit the form. Make sure your information and images are accurate.",
  },
  {
    question: "Is PawMart safe for buying and adopting pets?",
    answer:
      "Always prioritize animal welfare and your personal safety. Before adopting or purchasing a pet, verify the listing details, ask questions, and arrange a safe meeting. Never send money before verifying the seller and the transaction. Do not assume a listing or seller has been verified unless PawMart explicitly confirms it.",
  },
  {
    question: "How can I find a pet for adoption?",
    answer:
      "Visit Pets & Supplies and browse the available listings. Open a listing's details to review its description, location, and other information. Contact the listing owner to discuss the pet's needs, health, and adoption arrangements.",
  },
  {
    question: "Can I edit or remove my listings?",
    answer:
      "Your account dashboard is the place to check for listing management options. Open My Dashboard and look for My Listings. Available editing and removal features depend on the functionality enabled in your account.",
  },
  {
    question: "How do I contact PawMart support?",
    answer:
      "Visit our Contact page to find the available contact details and send a message. You can also email pawmart@gmail.com. If you use the contact form, message delivery depends on the contact service being configured.",
  },
  {
    question: "What should I include in a listing?",
    answer:
      "Use a clear title, the correct category, an accurate location, a helpful description, and a relevant image. For products, provide the correct price. For pet listings, describe the pet honestly and include important details that help potential adopters make an informed decision.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const idPrefix = useId();
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  return (
    <section className="bg-base-200 px-4 py-14 text-neutral dark:bg-neutral dark:text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section heading */}
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <MdHelpOutline size={30} aria-hidden="true" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Need some help?
          </p>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Find answers to common questions about listings, pet adoption, and
            using PawMart.
          </p>
        </motion.header>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            const triggerId = `${idPrefix}-faq-trigger-${index}`;
            const panelId = `${idPrefix}-faq-panel-${index}`;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.16),
                }}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 dark:bg-slate-900 ${
                  isOpen
                    ? "border-indigo-200 shadow-sm dark:border-indigo-400/40"
                    : "border-slate-200/80 dark:border-white/10"
                }`}
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFAQ(index)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-indigo-50/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 sm:px-6"
                  >
                    <span
                      className={`text-sm font-semibold leading-6 sm:text-base ${
                        isOpen
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                      }`}
                    >
                      {isOpen ? (
                        <MdRemove size={20} aria-hidden="true" />
                      ) : (
                        <MdAdd size={20} aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                  className="border-t border-slate-100 dark:border-white/10"
                >
                  <div className="px-5 py-5 sm:px-6">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-6 text-center dark:border-indigo-400/20 dark:bg-indigo-500/10 sm:mt-12 sm:p-8">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
            <MdPets size={23} aria-hidden="true" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Still have questions?
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
            If you need further assistance, get in touch with the PawMart team.
          </p>

          <Link
            to="/contact"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            Contact Us
            <MdArrowForward size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
