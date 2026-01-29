import React, { useState } from "react";

const faqData = [
  {
    question: "How do I sell a pet on PawMart?",
    answer:
      "To sell a pet, first create an account, then go to 'Add Listing', fill in the pet details, upload photos, and submit. Your listing will be visible to potential buyers.",
  },
  {
    question: "Is PawMart safe for buying and selling pets?",
    answer:
      "Yes! PawMart verifies sellers and encourages responsible transactions. Always communicate through the platform and follow our safety guidelines.",
  },
  {
    question: "How can I adopt a pet?",
    answer:
      "Browse the 'Pets & Supplies' section, choose a pet you like, and click 'View Details' to contact the seller or start the adoption process.",
  },
  {
    question: "Can I edit or delete my listings?",
    answer:
      "Yes, go to 'My Dashboard' → 'My Listings' to edit or remove any listing you've posted.",
  },
  {
    question: "How do I contact PawMart support?",
    answer:
      "You can reach our support team via the 'Help' section in the footer or by emailing support@pawmart.com.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-5xl mx-auto p-6 md:p-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-400">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-base-100 dark:bg-gray-800 shadow-sm"
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left bg- hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-gray-700 dark:text-gray-200">{faq.question}</span>
              <span className="text-indigo-500 dark:text-indigo-400 font-bold">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 border-t bg-gray-200 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
