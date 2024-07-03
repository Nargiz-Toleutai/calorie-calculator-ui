import React from "react";
import RecipeList from "@/components/Recipe/RecipeList";
import Layout from "@/components/Layout";

export const Meals = () => {
  return (
    <Layout imgUrl="/background-images/meals-page-background.jpg">
      <RecipeList />
    </Layout>
  );
};

export default Meals;
