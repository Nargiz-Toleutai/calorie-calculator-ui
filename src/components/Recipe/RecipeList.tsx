import React, { useEffect, useState } from "react";
import RecipeItem, { Product } from "./RecipeItem";
// import AddRecipeButton from "../buttons/AddRecipeButton";

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  products: Product[];
}

export const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const result = await fetch("http://localhost:3001/recipes");
        const data = await result.json();
        setRecipes(data);
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

    getRecipes();
    getCategory();
  }, []);

  return (
    <div className="recipe-page">
      <div className="header">
        <h1>Home Chef Recipes</h1>
      </div>
      <div className="body">
        <div className="recipe">
          <h2>Recipes</h2>
          {recipes.map((recipe) => (
            <RecipeItem
              key={recipe.id}
              name={recipe.name}
              //   products={recipe.products.map((product) => product.name)}
              id={recipe.id}
              category={recipe.category}
              products={[]}
            />
          ))}
        </div>
        <div>
          <p>{category?.name}</p>
          <p>{category?.icon}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
