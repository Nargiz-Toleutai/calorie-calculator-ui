import React from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
  portion: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Recipe {
  id: number;
  name: string;
  categoryId: number;
  category: Category;
  products: Product[];
}

interface RecipesByCategory {
  [category: string]: {
    recipes: Recipe[];
    total?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

export interface RecipeProps {
  recipesByCategory: RecipesByCategory;
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const RecipeItem: React.FC<RecipeProps> = ({ recipesByCategory, total }) => {
  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case "Breakfast":
        return "bg-blue-100 text-blue-700 bg-opacity-80 backdrop-blur";
      case "Lunch":
        return "bg-orange-100 text-orange-700 bg-opacity-80 backdrop-blur";
      case "Dinner":
        return "bg-green-100 text-green-700 bg-opacity-80 backdrop-blur";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative flex flex-col rounded-md items-center xl:container xl:mx-auto">
      {Object.keys(recipesByCategory).map((categoryName) => {
        const categoryData = recipesByCategory[categoryName];

        return categoryData.recipes.map((recipe) => (
          <Link
            href={`/edit-recipe/${recipe.id}`}
            key={recipe.id}
            className="justify-end w-full"
          >
            <div className="relative flex flex-col rounded-md items-center mb-8 transform transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col w-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table
                    className={`w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto ${getCategoryColor(
                      recipe.category.name
                    )} bg-opacity-80 backdrop-blur`}
                  >
                    <caption
                      className={`${getCategoryColor(
                        recipe.category.name
                      )} bg-opacity-80 backdrop-blur p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 `}
                    >
                      {recipe.name}
                      <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        {recipe.category.name}
                      </p>
                    </caption>
                    <thead
                      className={`${getCategoryColor(
                        recipe.category.name
                      )} text-xs  uppercase bg-gray-50 bg-opacity-80 backdrop-blur`}
                    >
                      <tr>
                        <th className="px-2 py-2">Products</th>
                        <th className="px-2 py-2">Protein</th>
                        <th className="px-2 py-2">Carbs</th>
                        <th className="px-2 py-2">Fat</th>
                        <th className="px-2 py-2">Portion(g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.products.map((product, index) => (
                        <tr
                          key={index}
                          className={`${getCategoryColor(
                            recipe.category.name
                          )} border-b hover:bg-green-50 bg-opacity-80 backdrop-blur`}
                        >
                          <td className="px-3 py-3 font-medium whitespace-nowrap text-black hover:bg-green-50 bg-opacity-80 backdrop-blur">
                            <Link href={`/edit-product/${product.id}`}>
                              {product.name}
                            </Link>
                          </td>
                          <td className="px-2 py-2">{product.protein}</td>
                          <td className="px-2 py-2">{product.carbs}</td>
                          <td className="px-2 py-2">{product.fat}</td>
                          <td className="px-3 py-2">
                            {Math.floor(product.portion)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {categoryData.total && (
                      <tfoot>
                        <tr
                          className={`${getCategoryColor(
                            recipe.category.name
                          )}  border-b border-t-2 border-t-slate-300 hover:bg-red-50 `}
                        >
                          <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap ">
                            Total
                          </td>
                          <td className="px-3 py-3">
                            {categoryData.total.protein}
                          </td>
                          <td className="px-3 py-3">
                            {categoryData.total.carbs}
                          </td>
                          <td className="px-3 py-3">
                            {categoryData.total.fat}
                          </td>
                          <td className="px-3 py-3"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </Link>
        ));
      })}
    </div>
  );
};

export default RecipeItem;
