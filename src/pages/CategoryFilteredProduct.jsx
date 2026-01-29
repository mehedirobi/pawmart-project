import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryFilteredProduct = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = `${categoryName} | PawMart`;

    fetch(`https://pawmart-server-six.vercel.app/products?category=${categoryName}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, [categoryName]);

  return (
    <div className="container mx-auto my-20 px-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        {categoryName} Listings
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item._id} className="card bg-indigo-50 shadow-lg rounded-xl">
              <img src={item.image} alt={item.name} className="h-48 w-full object-cover rounded-t-xl" />
              <div className="card-body">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-indigo-600 font-semibold">
                  {item.price && item.price > 0 ? `৳${item.price}` : "Free for Adoption"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilteredProduct;
