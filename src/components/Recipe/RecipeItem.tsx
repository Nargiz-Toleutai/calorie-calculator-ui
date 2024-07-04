import React, { useEffect, useState } from "react";
import { Category } from "./RecipeList";
import { Product } from "../Product/ProductItem";
import Link from "next/link";
import { User } from "../PersonalData";
import { calulatePFCForGoal } from "@/calculation/calories";

interface RecipeItemProps {
  id: number;
  name: string;
  category: Category;
  products: Product[];
  onEdit: (id: number) => void; // ?
  onDelete: (id: number) => void; // ?
  totalCalories?: number[];
}

const RecipeItem = ({ id, name, category, products }: RecipeItemProps) => {
  const [data, setData] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  function onEdit(id: number): void {
    throw new Error("Function not implemented.");
  }

  function onDelete(id: number): void {
    throw new Error("Function not implemented.");
  }

  const protein = products.reduce((acc, product) => acc + product.protein, 0);
  const carbs = products.reduce((acc, product) => acc + product.carbs, 0);
  const fat = products.reduce((acc, product) => acc + product.fat, 0);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user_info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        console.log("Fetched data:", res);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) {
    // We don't have all the data for the user, probably a bug
    return <p>Something went wrong</p>;
  }

  const { weight, age, height, activityLevel, gender, targetDeficitPercent } =
    data;
  const goal = calulatePFCForGoal(
    gender,
    weight,
    height,
    age,
    activityLevel,
    targetDeficitPercent
  );

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case "Breakfast":
        return "bg-blue-100 text-blue-700";
      case "Lunch":
        return "bg-orange-100 text-orange-700";
      case "Dinner":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculatePortion = (
    protein: number,
    carbs: number,
    fat: number,
    category: string
  ) => {
    switch (category) {
      case "Breakfast":
        return Math.floor(protein * 0.3 + carbs * 0.3 + fat * 0.3);
      case "Lunch":
        return Math.floor(protein * 0.4 + carbs * 0.4 + fat * 0.4);
      case "Dinner":
        return Math.floor(protein * 0.3 + carbs * 0.3 + fat * 0.3);
    }
  };

  // const adjustedProducts = products.map((product) => {
  //   const proteinRatio = goal.protein / protein;
  //   const carbsRatio = goal.carbs / carbs;
  //   const fatRatio = goal.fat / fat;

  //   const adjustedQuantity =
  //     (product.quantity * (proteinRatio + carbsRatio + fatRatio)) / 3;

  //   return {
  //     ...product,
  //     quantity: adjustedQuantity,
  //   };
  // });

  return (
    <Link href={`/edit-recipe/${id}`} className="justify-end">
      <div className="relative flex flex-col rounded-md items-center xl:container xl:mx-auto">
        <div className="flex flex-col ">
          <table className="w-full p-2 table-auto flex justify-center rounded-md flex-col items-center bg-white bg-opacity-80 backdrop-blur">
            <div
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 py-1 px-2 rounded-r-lg h-full flex text-center ${getCategoryColor(
                category.name
              )}`}
            >
              <span
                className="writing-mode-vertical-rl"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {category.name}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <h3 className="ml-4 text-lg font-bold">{name}</h3>
            </div>
            <thead className="bg-green-100 text-green-600 text-sm leading-normal rounded-bl-lg rounded-tr-lg pl-6">
              <tr className=" text-green-600 text-sm leading-normal ">
                <th className="py-3 px-6 text-left">Products</th>
                <th className="py-3 px-6 text-left">Protein</th>
                <th className="py-3 px-6 text-left">Carbs</th>
                <th className="py-3 px-6 text-left">Fat</th>
                <th className="py-3 px-6 text-left">Portion</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light pl-6">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-green-100 rounded">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="py-3 px-8 text-right">{product.protein}</td>
                  <td className="py-3 px-8 text-right">{product.carbs}</td>
                  <td className="py-3 px-8 text-right">{product.fat}</td>
                  <td className="py-3 px-8 text-right">
                    {calculatePortion(
                      product.protein,
                      product.carbs,
                      product.fat,
                      category.name
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tr className="hover:bg-green-100">
              <td className="py-3 px-6 text-right whitespace-nowrap">Total</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {protein}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">{carbs}</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">{fat}</td>
            </tr>
            <tr className="hover:bg-green-100">
              <td className="py-3 px-6 text-right whitespace-nowrap">Goal</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {goal.protein}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {goal.carbs}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {goal.fat}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </Link>
  );
};

export default RecipeItem;
