import React from "react";
import RecipeList from "@/components/Recipe/RecipeList";
import ProductList from "@/components/Product/ProductList";
import Layout from "@/components/Layout";
import AddNewRecipe from "@/components/Recipe/AddNewRecipe";

export const Recipes = () => {
  return (
    <Layout>
      <AddNewRecipe />
    </Layout>
  );
};

export default Recipes;
