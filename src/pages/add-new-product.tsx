import React from "react";

import Layout from "@/components/Layout";
import AddNewProduct from "@/components/Product/AddNewProduct";

export const AddNewProductePage = () => {
  return (
    <Layout imgUrl="./background-images/add-new-recipe-page.jpg">
      <AddNewProduct />
    </Layout>
  );
};

export default AddNewProductePage;
