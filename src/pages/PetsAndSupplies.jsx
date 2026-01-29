import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const categoryMap = {
  All: "",
  Pets: "Pets",
  "Pet Food": "Pet Food",
  Accessories: "Accessories",
  "Pet Care Products": "Pet Care Products",
};

const PetsAndSupplies = () => {
  const [listings, setListings] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    const queryParam = categoryMap[filterCategory]
      ? `?category=${encodeURIComponent(categoryMap[filterCategory])}`
      : "";
    fetch(`https://pawmart-server-six.vercel.app/products${queryParam}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setCurrentPage(1); // reset page on category change
      })
      .catch((err) => console.error("Error fetching listings:", err))
      .finally(() => setLoading(false));
  }, [filterCategory]);

  // Pagination logic
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const paginatedListings = listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Skeleton placeholder
  const skeletonArray = Array.from({ length: itemsPerPage });

  return (
    <div className="my-10 px-5 container mx-auto bg-base-200">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        Pets & Supplies
      </h2>

      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {Object.keys(categoryMap).map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm hover:text-white font-bold text-lg btn-outline btn-primary ${
              filterCategory === cat
                ? "bg-indigo-600 text-white"
                : "text-gray-500"
            }`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {skeletonArray.map((_, idx) => (
            <div
              key={idx}
              className="card bg-white shadow-lg rounded-xl animate-pulse"
            >
              <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded-t-xl" />
              <div className="card-body p-4 space-y-2">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {paginatedListings.map((item) => (
              <div
                key={item._id}
                className="card bg-white shadow-lg rounded-xl hover:scale-101 hover:bg-indigo-50 transition-transform duration-200"
              >
                <figure className="overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold">{item.name}</h2>
                  <p className="text-gray-500 font-medium">
                    Category: {item.category}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Location: {item.location}
                  </p>
                  <p className="text-indigo-600 font-semibold mt-1">
                    {item.price && item.price > 0
                      ? `Price: ${item.price}`
                      : "Free for Adoption"}
                  </p>
                  <div className="card-actions justify-end mt-3">
                    <Link
                      to={`/listing-details/${item._id}`}
                      className="btn btn-sm font-bold text-lg btn-outline btn-primary"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded-lg font-semibold border ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center col-span-full text-gray-500">
          No listings found.
        </p>
      )}
    </div>
  );
};

export default PetsAndSupplies;
