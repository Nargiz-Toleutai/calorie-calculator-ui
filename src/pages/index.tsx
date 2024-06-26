import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

import HomePageInfoPanel from "@/components/HomePageInfoPanel";
import AppQRCode from "@/components/AppQRCode";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const appUrl = "https://www.yourapp.com/download"; // Replace with your actual URL
  return (
    <div className="home-page">
      <Layout>
        <HomePageInfoPanel />
        <div className="container mx-auto p-4">
          <AppQRCode url={appUrl} />
        </div>
      </Layout>
    </div>
  );
}
