import React from "react";

import Layout from "@/components/Layout";
import AddNewRecipe from "@/components/Recipe/AddNewRecipe";

export const AddNewRecipePage = () => {
  return (
    <Layout imgUrl="./background-images/add-new-recipe-page.jpg">
      <AddNewRecipe />
    </Layout>
  );
};

export default AddNewRecipePage;
