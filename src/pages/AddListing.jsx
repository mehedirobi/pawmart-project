import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const AddListing = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    category: "Pets",
    price: "",
    location: "",
    description: "",
    image: "",
    date: "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (payload.category === "Pets") payload.price = 0;

    try {
      const res = await fetch("https://pawmart-server-six.vercel.app/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.insertedId) {
        toast.success("Listing added successfully 👌", { position: "top-center" });
        setFormData({
          name: "",
          category: "Pets",
          price: "",
          location: "",
          description: "",
          image: "",
          date: "",
          email: user?.email || "",
        });
      } else {
        toast.error("Failed to add listing.", { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { position: "top-center" });
    }
  };

  return (
    <div className="py-20 bg-base-200 min-h-screen">
      <Toaster />
      <div className="card w-full max-w-lg mx-auto bg-white shadow-2xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Add New Listing
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product / Pet Name"
            className="input bg-gray-200 input-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select bg-gray-200 select-bordered w-full focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Pets">Pets</option>
            <option value="Food">Food</option>
            <option value="Accessories">Accessories</option>
            <option value="Care Products">Care Products</option>
          </select>

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="input bg-gray-300 input-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.price}
            onChange={handleChange}
            disabled={formData.category === "Pets"}
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="input bg-gray-200 input-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            className="textarea bg-gray-200 textarea-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Image */}
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            className="input bg-gray-200 input-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.image}
            onChange={handleChange}
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            className="input bg-gray-200 input-bordered w-full focus:ring-2 focus:ring-indigo-400"
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            className="input bg-gray-200 input-bordered w-full cursor-not-allowed"
            value={formData.email}
            readOnly
          />

          <button
            type="submit"
            className="btn btn-sm btn-outline w-full font-bold text-lg btn-primary"
          >
            Add Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
