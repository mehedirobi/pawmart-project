import React, { useState } from "react";
import toast from "react-hot-toast";


const OrderModal = ({ listing, user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    productId: listing?._id,
    productName: listing?.name,
    quantity: listing?.category?.toLowerCase() === "pet" ? 1 : 1,
    price: listing?.price || 0,
    address: "",
    date: "",
    phone: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.insertedId) {
        toast.success("Order placed successfully!");
        onClose();
      } else {
        toast.error("Failed to save order!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error placing order!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-y-auto py-20 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn btn-sm btn-circle bg-gray-100 hover:bg-gray-200"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-5 text-center text-indigo-600">
          Place Your Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="productId"
            value={formData.productId}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="productName"
            value={formData.productName}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            readOnly={listing.category.toLowerCase() === "pet"}
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <textarea
            name="notes"
            placeholder="Additional Notes"
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-primary w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
