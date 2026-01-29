import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import OrderModal from "../components/OrderModal";
import { AuthContext } from "../context/AuthContext";

const ListingDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`https://pawmart-server-six.vercel.app/products/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // stop loading
  }, [id]);

  // Skeleton Loader
  if (loading) {
    return (
      <div className="my-10 px-5 max-w-4xl mx-auto animate-pulse">
        <div className="card lg:card-side bg-white dark:bg-neutral shadow-xl p-5">
          <figure className="bg-gray-300 dark:bg-gray-700 h-80 w-full rounded-lg" />
          <div className="card-body space-y-4 flex-1">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 w-3/4 rounded" />
            <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/2 rounded" />
            <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/3 rounded" />
            <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/4 rounded mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
        Listing not found.
      </p>
    );

  return (
    <div className="my-10 px-5 max-w-4xl mx-auto">
      <Toaster position="top-center" />
      <div className="card lg:card-side hover:bg-indigo-50 bg-white dark:bg-neutral shadow-xl hover:scale-101 transition-transform duration-300 p-5">
        <figure>
          <img
            src={listing.image}
            alt={listing.name}
            className="h-80 w-full object-cover rounded-lg"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl">{listing.name}</h2>
          <p>
            <strong>Category:</strong> {listing.category}
          </p>

          <p>
            <strong>Price:</strong>{" "}
            {listing.price ? `${listing.price} taka` : "Free for Adoption"}
          </p>
          <p>
            <strong>Location:</strong> {listing.location}
          </p>

          <div className="card-actions mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-sm btn-outline font-bold text-lg btn-primary"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <OrderModal
          listing={listing}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ListingDetails;
