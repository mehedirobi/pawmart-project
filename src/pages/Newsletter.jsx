import React, { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter your email!",
        confirmButtonColor: "#6366F1", // indigo-500
      });
      return;
    }

    // Success SweetAlert
    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: `You have successfully subscribed with ${email}`,
      confirmButtonColor: "#6366F1",
    });

    setEmail("");
  };

  return (
    <section className="bg-indigo-50 dark:bg-gray-800 py-12 px-4 text-center rounded-xl shadow-md max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
        Get Pet Tips Weekly 🐾
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Subscribe to our newsletter and never miss updates, tips, and special offers for your furry friends!
      </p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center gap-3"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
          required
        />
        <button
          type="submit"
          className="btn btn-sm btn-outline py-5 font-bold text-lg btn-primary"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
