import React from "react";
import ProductList from "@/components/Product/ProductList";
import Layout from "@/components/Layout";

export const Dashboard = () => {
  return (
    <Layout imgUrl="/background-images/products-page-background.jpg">
      <ProductList />
    </Layout>
  );
};

export default Dashboard;
