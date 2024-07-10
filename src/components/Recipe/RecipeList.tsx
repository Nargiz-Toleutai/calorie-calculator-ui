import React, { useEffect, useState } from "react";
import RecipeItem, { RecipeProps } from "./RecipeItem";
import Link from "next/link";
import { useRouter } from "next/router";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeProps | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    if (authError) {
      router.push("/login");
    }
  }, [authError, router]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const recipesData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/_with_portions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!recipesData.ok) {
          throw new Error("Network response recipesData was not ok");
        }

        const recipes = await recipesData.json();

        console.log("Fetched recipes data:", recipes);

        setRecipes(recipes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [token]);

  if (!recipes) {
    return <div>Loading...</div>;
  }

  const filteredRecipes = Object.keys(recipes.recipesByCategory).reduce(
    (acc, categoryName) => {
      const categoryData = recipes.recipesByCategory[categoryName];
      const filteredRecipes = categoryData.recipes.filter(
        (recipe: any) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          recipe.products.some((product: any) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      if (filteredRecipes.length > 0) {
        acc[categoryName] = { ...categoryData, recipes: filteredRecipes };
      }
      return acc;
    },
    {} as RecipeProps["recipesByCategory"]
  );

  return (
    <main className=" xl:container xl:mx-auto flex-1 pt-24 px-4 py-6 h-full">
      <div className="flex justify-between items-center w-full">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-1/3 p-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center ">
        <Link
          href="/account"
          className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700 cursor-pointer"
        >
          Change goal: {recipes.total.calories} Kcal
        </Link>
        {Object.keys(recipes.recipesByCategory).length > 0 && (
          <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700">
            <Link href={"/add-new-recipe"}>Add new Recipe</Link>
          </button>
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8">
        <table className="w-full text-sm text-left text-green-600">
          <caption className="bg-opacity-80  bg-green-50 backdrop-blur p-4 uppercase font-semibold text-centre rtl:text-right text-green-900">
            Your goal
          </caption>
          <thead className="text-xs text-green-700 uppercase bg-green-50 ">
            <tr>
              <th className="px-6 py-3">Calories</th>
              <th className="px-6 py-3">Protein</th>
              <th className="px-6 py-3">Carbs</th>
              <th className="px-6 py-3">Fat</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-200  border-gray-700 hover:bg-red-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {recipes.total.calories}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {recipes.total.protein}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {recipes.total.carbs}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {recipes.total.fat}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {!Object.keys(recipes.recipesByCategory).length ? (
        <div className="flex flex-col items-center justify-center h-full py-10 backdrop-blur bg-opacity-80 bg-white sm:rounded-lg mt-20">
          <p className="text-lg font-semibold text-gray-700">
            You don&apos;t have any recipes
          </p>
          <p>Do you want to add some?</p>
          <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700">
            <Link href="/add-new-recipe">Add new Recipe</Link>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {Object.keys(filteredRecipes).map((categoryName) => (
            <RecipeItem
              key={categoryName}
              recipesByCategory={{
                [categoryName]: filteredRecipes[categoryName],
              }}
              total={recipes.total}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default RecipeList;
