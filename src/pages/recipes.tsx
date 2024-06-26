import React from "react";
import { Layout } from "lucide-react";
import RecipeList from "@/components/Recipe/RecipeList";

export const Recipes = () => {
  return (
    <Layout>
      <RecipeList />
    </Layout>
  );
};

export default Recipes;
