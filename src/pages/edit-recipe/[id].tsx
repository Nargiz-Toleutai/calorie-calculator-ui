import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Product } from "../../components/Recipe/AddNewRecipe";

import EditRecipeForm, {
  Category,
  Recipe,
  SelectedProduct,
} from "@/components/Recipe/EditRecipeForm";
import ErrorPage from "../../components/errorPage";

const EditRecipe = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [categoryId, setCategoryId] = useState<Category["id"]>(1);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (authError) {
      return;
    }
  }, [authError, router]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !id) return;
      try {
        const responseCategories = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseProducts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseRecipe = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          !responseCategories.ok ||
          !responseProducts.ok ||
          !responseRecipe.ok
        ) {
          throw new Error("Recipe not found");
        }

        const resCategories = await responseCategories.json();
        const resProducts = await responseProducts.json();
        const resRecipe = await responseRecipe.json();

        setCategories(resCategories);
        setProducts(resProducts);
        setSelectedProducts(resRecipe.products);
        setCategoryId(resRecipe.categoryId);
        setRecipe(resRecipe);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Recipe not found");
        // } finally {
        //   setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Layout imgUrl="/background-images/login-page-background.jpg">
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center pt-32-">
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full mt-24">
          {authError ? (
            <ErrorPage error={authError} page={"/meals"} />
          ) : (
            <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
          )}

          {recipe && (
            <EditRecipeForm
              id={id as string}
              recipe={recipe}
              products={products}
              categories={categories}
              defaultCategoryId={categoryId}
              defaultSelectedProducts={selectedProducts}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditRecipe;
