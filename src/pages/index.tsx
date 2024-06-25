import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

import HomePageInfoPanel from "@/components/HomePageInfoPanel";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="home-page">
      <Layout>
        <HomePageInfoPanel />
      </Layout>
    </div>
  );
}
