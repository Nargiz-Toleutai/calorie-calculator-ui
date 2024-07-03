// import React, { useEffect, useState } from "react";
// import RecipeItem from "./RecipeItem";
// import { Product } from "../Product/ProductItem";
// import Link from "next/link";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
//   DraggableProvided,
//   DroppableProvided,
// } from "react-beautiful-dnd";

// export interface Category {
//   id: number;
//   name: string;
//   icon: string;
// }

// export interface Recipe {
//   id: number;
//   name: string;
//   category: Category;
//   products: Product[];
// }

// const RecipeList: React.FC = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const getRecipes = async () => {
//       try {
//         const result = await fetch("http://localhost:3001/recipes");
//         const data = await result.json();
//         setRecipes(data);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     getRecipes();
//   }, []);

//   const handleViewDetails = (id: number) => {
//     console.log(`Viewing details for recipe ID: ${id}`);
//   };

//   const handleEditRecipe = (id: number) => {
//     console.log(`Editing recipe ID: ${id}`);
//   };

//   const handleDeleteRecipe = (id: number) => {
//     console.log(`Deleting recipe ID: ${id}`);
//   };

//   const handleAddRecipe = () => {
//     console.log("Adding a new recipe");
//   };

//   const handleOnDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;

//     const items = Array.from(recipes);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     setRecipes(items);

//     // need to create this request !!!
//     try {
//       const response = await fetch(
//         "http://localhost:3001/recipes/update-order",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(items),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       console.log("Recipe order saved");
//     } catch (error) {
//       console.error("Could not update recipe order", error);
//     }
//   };

//   const filteredRecipes = recipes.filter(
//     (recipe) =>
//       recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       recipe.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       recipe.products.some((product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex pt-16">
//       <main className="flex-1 p-8">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold">Recipes</h1>
//           <input
//             type="text"
//             placeholder="Search anything..."
//             className="w-1/3 p-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex justify-end">
//           <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700">
//             <Link href={"/add-new-recipe"}>Add new Recipe</Link>
//           </button>
//         </div>

//         {filteredRecipes.map((recipe, index) => (
//           <div key={index}>
//             <RecipeItem
//               id={recipe.id}
//               name={recipe.name}
//               category={recipe.category}
//               products={recipe.products}
//               onEdit={handleEditRecipe}
//               onDelete={handleDeleteRecipe}
//             />

//             {/* {recipe.products.map((product) => (
//               <div key={product.id}>
//                 <p>{product.protein}</p>
//               </div>
//             ))} */}
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default RecipeList;

import React, { useEffect, useState } from "react";
import RecipeItem from "./RecipeItem";
import { Product } from "../Product/ProductItem";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "react-beautiful-dnd";
import CalorieCalculator from "../CalorieCalculator";
import { User } from "./../PersonalData";
import { calulateCalories, calulatePFCForGoal } from "@/calculation/calories";

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  products: Product[];
}

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User>();
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const recipes = await fetch("http://localhost:3001/recipes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const recipesData = await recipes.json();

        const user = await fetch(`http://localhost:3001/user_info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await user.json();

        setRecipes(recipesData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getRecipes();
  }, [token]);

  const handleViewDetails = (id: number) => {
    console.log(`Viewing details for recipe ID: ${id}`);
  };

  const handleEditRecipe = (id: number) => {
    console.log(`Editing recipe ID: ${id}`);
  };

  const handleDeleteRecipe = (id: number) => {
    console.log(`Deleting recipe ID: ${id}`);
  };

  const handleAddRecipe = () => {
    console.log("Adding a new recipe");
  };

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(recipes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRecipes(items);

    // need to create this request !!!
    try {
      const response = await fetch(
        "http://localhost:3001/recipes/update-order",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(items),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Recipe order saved");
    } catch (error) {
      console.error("Could not update recipe order", error);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.products.some((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (!userData) {
    return <p>Something went wrong</p>;
  }
  const { weight, age, height, activityLevel, gender, targetDeficitPercent } =
    userData;

  const caloriesFromPFC = calulateCalories(
    gender,
    weight,
    height,
    age,
    activityLevel,
    targetDeficitPercent
  );

  console.log({ caloriesFromPFC });

  return (
    <main className="flex-1 pt-24 px-4 py-6 h-full">
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
          Your goal: {caloriesFromPFC} Kcal
        </Link>

        <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700">
          <Link href={"/add-new-recipe"}>Add new Recipe</Link>
        </button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="recipes">
          {(provided: DroppableProvided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredRecipes.map((recipe, index) => (
                <Draggable
                  key={recipe.id}
                  draggableId={recipe.id.toString()}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <RecipeItem
                        id={recipe.id}
                        name={recipe.name}
                        category={recipe.category}
                        products={recipe.products}
                        onEdit={handleEditRecipe}
                        onDelete={handleDeleteRecipe}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
};

export default RecipeList;
