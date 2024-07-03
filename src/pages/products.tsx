import React from "react";
import RecipeList from "@/components/Recipe/RecipeList";
import ProductList from "@/components/Product/ProductList";
import Layout from "@/components/Layout";
import AddNewRecipe from "@/components/Recipe/AddNewRecipe";

export const Dashboard = () => {
  return (
    <Layout>
      <ProductList />
    </Layout>
  );
};

export default Dashboard;
