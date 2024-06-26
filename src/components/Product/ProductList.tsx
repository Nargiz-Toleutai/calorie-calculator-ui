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

const CategoryItem = ({ name, icon, onClick }: Category) => {
  return (
    <button onClick={onClick}>
      <label>{icon}</label>
      <h3>{name}</h3>
    </button>
  );
};

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const result = await fetch("http://localhost:3001/products");
        const data = await result.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const getCategories = async () => {
      try {
        const result = await fetch("http://localhost:3001/categories");
        const categoriesData = await result.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getProducts();
    getCategories();
  }, []);

  return (
    <>
      {products.map((product) => {
        <ProductItem
          key={product.id}
          id={product.id}
          name={product.name}
          unit={product.unit}
          quantity={product.quantity}
          protein={product.protein}
          carbs={product.carbs}
          fat={product.fat}
          calories={product.calories}
          image={product.image}
        />;
      })}
    </>
  );
};

export default ProductList;
