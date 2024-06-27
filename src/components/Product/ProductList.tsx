import React, { useEffect, useState } from "react";

import SearchPanel from "../SearchPanel";
import ProductItem, { Product } from "./ProductItem";
import Layout from "../Layout";

interface Category {
  id: number;
  name: string;
  icon: string;
  onClick: () => void;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>();

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

  console.log(products);

  return (
    <>
      {products.map((product) => {
        <ProductItem
          key={product.id}
          id={product.id}
          name={product.name}
          unit={product.unit}
          protein={product.protein}
          carbs={product.carbs}
          fat={product.fat}
          calories={product.calories}
          image={product.image}
        />;
      })}
      {category ? (
        <p>
          category: {category.name} {category.icon}{" "}
        </p>
      ) : (
        <p>non</p>
      )}
    </>
  );
};

export default ProductList;
