import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import ProductList from "@/components/Product/ProductList";
import { BookOpenText, ChefHat, Soup } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const HomePageInfoPanel = () => {
  return (
    <div className="home-page">
      <div className="relative">
        <img
          src="./background-images/home-page-background-img.jpg"
          alt="home-page-img"
          className="w-1 h-1"
          width={200}
          height={200}
        />
      </div>
      <div className="body">
        <h2>Recipe Nutrient Calculator</h2>
        <p>
          Track your nutrients accuratly, count calories on any diet, and find
          your personalized nutritious recipes ready to use in one go // CHANGE
        </p>
        <ProductList />
        <div>
          <h3>SELECT & ADD INGREDIENTS</h3>
          <Soup size={64} />
          <p>Type and search for the ingredients of your choice</p>
          <h3>CREATE RECIPE</h3>
          <ChefHat size={64} color="green" />
          <p>Prepare your own meal with the selected ingredients</p>
          <h3>GET NUTRITION INFORMATION</h3>
          <BookOpenText size={64} />
          <p>
            Get your personalized information ready with properly balanced
            nutrition
          </p>
        </div>
      </div>
      <div className="footer">
        <button>
          <Link href="/register">Get started now</Link>
        </button>
      </div>
    </div>
  );
};

export default HomePageInfoPanel;
