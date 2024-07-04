import React from "react";
import RecipeList from "@/components/Recipe/RecipeList";
import ProductList from "@/components/Product/ProductList";
import Layout from "@/components/Layout";
import AddNewRecipe from "@/components/Recipe/AddNewRecipe";

export const Dashboard = () => {
  return (
    <Layout imgUrl="/background-images/products-page-background.jpg">
      <ProductList />
    </Layout>
  );
};

export default Dashboard;
