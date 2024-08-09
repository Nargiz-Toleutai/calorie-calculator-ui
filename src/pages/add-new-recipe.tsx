import React from "react";

import Layout from "@/components/Layout";
import AddRecipe from "@/components/Recipe/AddRecipe";

export const AddNewRecipePage = () => {
  return (
    <Layout imgUrl="./background-images/add-new-recipe-page.jpg">
      <AddRecipe />
    </Layout>
  );
};

export default AddNewRecipePage;
