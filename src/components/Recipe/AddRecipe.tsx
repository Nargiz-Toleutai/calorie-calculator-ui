import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RecipeForm from "./RecipeForm";
import { Recipe } from "./types";
import { Category } from "../../models/category";
import { Product } from "../../models/product";

const AddRecipe = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const responseCategories = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const responseProducts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!responseCategories.ok || !responseProducts.ok) {
          throw new Error("Network response was not ok");
        }

        setCategories(await responseCategories.json());
        setProducts(await responseProducts.json());
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };

    fetchData();
  }, [router]);

  const handleAddRecipe = async (data: Recipe) => {
    const storedToken = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      router.push("/meals");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return authError ? (
    <p className="text-red-500">{authError}</p>
  ) : (
    <RecipeForm
      onSubmit={handleAddRecipe}
      categories={categories}
      products={products}
      buttonText="Add Recipe"
    />
  );
};

export default AddRecipe;
