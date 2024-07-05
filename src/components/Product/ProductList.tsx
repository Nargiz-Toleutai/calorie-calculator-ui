import React, { useEffect, useState } from "react";
import ProductItem, { Product } from "./ProductItem";
import Layout from "../Layout";
import { SERVER_DOMAIN } from "./../../utils";
import Link from "next/link";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const getProducts = async () => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (result.status === 401) {
          setAuthError("You are not authorized. Redirecting to login...");
          return;
        }
        const data = await result.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getProducts();
  }, [token]);

  console.log({ products });

  if (authError) {
    return (
      <Layout>
        <div>{authError}</div>
      </Layout>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-30 p-6 bg-cover bg-no-repeat bg-center min-h-screen">
      <div className="flex justify-between items-center w-full">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-1/3 p-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-20"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button className="bg-green-500 flex justify-between items-center  text-white font-bold py-2 px-4 mt-5 mb-5 rounded-md hover:bg-green-700">
        <Link href={"/add-new-product"}>Add new product</Link>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductItem
            id={product.id}
            key={product.id}
            image={`${SERVER_DOMAIN}${product.image}`}
            name={product.name}
            protein={product.protein}
            carbs={product.carbs}
            fat={product.fat}
            calories={product.calories}
            unit={product.unit}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
