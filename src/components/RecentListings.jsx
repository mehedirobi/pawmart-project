import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    fetch("https://pawmart-server-six.vercel.app/products/recent")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setListings(shuffled);
      })
      .catch((err) => console.error("Error fetching listings:", err))
      .finally(() => setLoading(false)); // stop loading
  }, []);

  // Skeleton placeholders
  const skeletonArray = Array.from({ length: 6 });

  return (
    <section className="my-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-600 dark:text-indigo-400">
        Recent Pet Listings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading
          ? skeletonArray.map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral rounded-2xl shadow-lg animate-pulse h-[400px]"
              >
                <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded-t-2xl" />
                <div className="p-5 space-y-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mt-2" />
                </div>
              </div>
            ))
          : listings.map((pet) => (
              <div
                key={pet._id}
                className="bg-white hover:bg-indigo-50 dark:bg-neutral rounded-2xl shadow-lg 
                           hover:shadow-2xl hover:-translate-y-1 
                           transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="h-48 w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {pet.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Category: <span className="font-semibold">{pet.category}</span>
                  </p>

                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {pet.price && pet.price > 0
                      ? `Price: ${pet.price} Taka`
                      : "Free for Adoption"}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Location: {pet.location}
                  </p>

                  {/* Button */}
                  <div className="pt-4 flex justify-end">
                    <Link
                      to={`/listing-details/${pet._id}`}
                      className="btn btn-sm font-bold text-lg btn-outline btn-primary"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            No listings found.
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentListings;
