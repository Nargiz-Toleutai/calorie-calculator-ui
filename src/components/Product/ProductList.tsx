import React, { useEffect, useState } from "react";
import ProductItem, { Product } from "./ProductItem";
import Layout from "../Layout";
import { SERVER_DOMAIN } from "./../../utils";
import Link from "next/link";

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

  console.log({ products });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-24 gap-6 p-6">
        <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700">
          <Link href={"/add-new-product"}>Add new Recipe</Link>
        </button>
        {products.map((product) => (
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
    </>
  );
};

export default ProductList;
