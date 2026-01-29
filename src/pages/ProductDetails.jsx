import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://pawmart-server-six.vercel.app/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product)
    return (
      <p className="text-center mt-20 text-gray-500 font-semibold">
        Loading...
      </p>
    );

  return (
    <div className="my-20 px-5 container mx-auto">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Product Details
      </h2>

      <div className="card max-w-md mx-auto bg-indigo-50 shadow-lg rounded-xl hover:scale-105 transition-transform duration-300">
        <figure className="overflow-hidden rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </figure>

        <div className="card-body text-center">
          <h2 className=" text-center text-2xl font-bold">Name: {product.name}</h2>
          <p className="text-gray-500 font-medium">Category: {product.category}</p>
          <p className="text-indigo-600 font-semibold">
            {product.price && product.price > 0
              ? `Price: ${product.price}`
              : "Free for Adoption"}
          </p>
          <p className="text-gray-400 mt-1">Location: {product.location}</p>
          <p className="text-gray-700 mt-3">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
