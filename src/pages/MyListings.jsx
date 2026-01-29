import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://pawmart-server-six.vercel.app/products?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch(() => toast.error("Failed to load listings"));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.deletedCount > 0) {
        toast.success("Listing deleted");
        setListings((prev) => prev.filter((item) => item._id !== id));
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedData = {
      name: form.name.value,
      category: form.category.value,
      price: Number(form.price.value),
      location: form.location.value,
      description: form.description.value,
    };

    try {
      const res = await fetch(
        `http://localhost:3000/products/${editingItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (res.ok) {
        toast.success("Listing updated");
        setListings((prev) =>
          prev.map((item) =>
            item._id === editingItem._id
              ? { ...item, ...updatedData }
              : item
          )
        );
        setEditingItem(null);
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl text-center font-bold text-indigo-600">My Listings</h2>
      </div>

      {/* Empty State */}
      {listings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          You haven’t added any listings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="card bg-white shadow-lg rounded-xl hover:scale-101 hover:bg-indigo-50 transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover rounded-t-xl"
              />

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold">{item.name}</h3>

                <p className="text-sm text-gray-500">
                  Category: {item.category}
                </p>

                <p className="font-semibold text-indigo-600">
                  {item.price > 0 ? `৳ ${item.price}` : "Free for Adoption"}
                </p>

                <p className="text-xs text-gray-400">
                  Location: {item.location}
                </p>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="btn btn-sm btn-outline font-bold text-lg btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm btn-outline font-bold text-lg hover:bg-red-600 hover:text-white border-indigo-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-indigo-600 mb-4">
              Edit Listing
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="name"
                defaultValue={editingItem.name}
                className="input input-bordered w-full"
                required
              />
              <input
                name="category"
                defaultValue={editingItem.category}
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                name="price"
                defaultValue={editingItem.price}
                className="input input-bordered w-full"
              />
              <input
                name="location"
                defaultValue={editingItem.location}
                className="input input-bordered w-full"
              />
              <textarea
                name="description"
                defaultValue={editingItem.description}
                className="textarea textarea-bordered w-full"
              />

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-sm btn-outline font-bold text-lg hover:bg-red-600 hover:text-white border-indigo-600"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-outline font-bold text-lg btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyListings;
