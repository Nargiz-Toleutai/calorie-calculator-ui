import React, { useEffect, useState } from "react";
import ProductItem, { Product } from "./ProductItem";
import Layout from "../Layout";
import { SERVER_DOMAIN } from "./../../utils";

interface Category {
  id: number;
  name: string;
  icon: string;
  onClick: () => void;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const result = await fetch("http://localhost:3001/products");
        const data = await result.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const getCategory = async () => {
      try {
        const result = await fetch("http://localhost:3001/categories");
        const data = await result.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getProducts();
    getCategory();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-24 gap-6 p-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={`${SERVER_DOMAIN}${product.image}`}
              alt={product.name}
              className="w-32 h-32 object-cover mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-gray-500">{product.unit}</p>
            <p className="text-gray-500">{product.protein}g Protein</p>
            <p className="text-gray-500">{product.carbs}g Carbs</p>
            <p className="text-gray-500">{product.fat}g Fat</p>
            <p className="text-gray-500">{product.calories} Kcal</p>
          </div>
        ))}
      </div>
      {category ? (
        <div className="flex items-center p-4">
          <p className="text-xl font-bold">{category.name}</p>
          <img
            src={category.icon}
            alt={category.name}
            className="w-8 h-8 ml-2"
          />
        </div>
      ) : (
        <p className="p-4 text-gray-500">No category selected</p>
      )}
    </Layout>
  );
};

export default ProductList;
