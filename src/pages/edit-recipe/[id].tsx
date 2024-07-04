// import React from "react";

// import Layout from "@/components/Layout";
// import EditRecipe from "@/components/Recipe/EditRecipe";

// export const EditRecipePage = () => {
//   return (
//     <Layout>
//       <EditRecipe recipeId={1} />
//     </Layout>
//   );
// };

// export default EditRecipePage;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/router";
import Link from "next/link";
import { Product } from "../../components/Product/ProductItem";
import { Category } from "./../../components/Recipe/RecipeList";
import Layout from "@/components/Layout";

const RecipeValidator = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    categoryId: z.number().int(),
    products: z
      .array(
        z.object({
          productId: z.number().int(),
        })
      )
      .nonempty({ message: "At least one product must be selected" }),
  })
  .strict();

export type Recipe = z.infer<typeof RecipeValidator>;

const notifyUpdate = () => {
  toast.success("Recipe was updated");
};

const notifyDelete = () => {
  toast.success("Recipe was delete ❌");
};

const EditRecipe = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number }[]
  >([]);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();
  const id = router.query.id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Recipe>({
    resolver: zodResolver(RecipeValidator),
    defaultValues: {
      name: "",
      categoryId: 1,
      products: [],
    },
  });

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      return;
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const responseCategories = await fetch(
          `http://localhost:3001/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseProducts = await fetch(`http://localhost:3001/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseRecipe = await fetch(
          `http://localhost:3001/recipes/${id}`,
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
          throw new Error("Network response was not ok");
        }

        const resCategories = await responseCategories.json();
        const resProducts = await responseProducts.json();
        const resRecipe = await responseRecipe.json();

        setCategories(resCategories);
        setProducts(resProducts);
        setSelectedProducts(resRecipe.products);
        console.log(resRecipe);
        reset({
          name: resRecipe.name,
          categoryId: resRecipe.categoryId,
          products: resRecipe.products,
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };

    fetchData();
  }, [token, reset, id]);

  useEffect(() => {
    if (selectedProducts && selectedProducts[0]) {
      setValue("products", [selectedProducts[0], ...selectedProducts.slice(1)]);
    }
  }, [selectedProducts, setValue]);

  const onSubmitForm = async (data: Recipe) => {
    try {
      const response = await fetch(`http://localhost:3001/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();
      console.log("Recipe was changed", responseData);
      notifyUpdate();
      router.push("/meals");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleAddProduct = (productId: number) => {
    if (!selectedProducts.find((product) => product.productId === productId)) {
      setSelectedProducts([...selectedProducts, { productId }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.productId !== productId)
    );
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/recipes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      notifyDelete();
      router.push("/meals");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
    <Layout>
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-32"
        style={{
          backgroundImage:
            "url('../background-images/add-new-recipe-page.jpg')",
        }}
      >
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
          {authError && <p className="text-red-500">{authError}</p>}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Recipe Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-gray-700">
                Category
              </label>

              <Select
                id="categoryId"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                onChange={(selectedOption) => {
                  setValue("categoryId", selectedOption?.value ?? 1);
                }}
                defaultValue={{
                  value: categories.find((c) => c.id === Number(id))?.id,
                  label: categories.find((c) => c.id === Number(id))?.name,
                }}
                className="w-full"
              />

              {errors.categoryId && (
                <p className="text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="products" className="block text-gray-700">
                Products
              </label>

              <Select
                id="product-list"
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                onChange={(selectedOption) =>
                  selectedOption && handleAddProduct(selectedOption.value)
                }
                className="w-full"
              />

              <ul className="mt-2">
                {selectedProducts.map((product) => (
                  <li
                    key={product.productId}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md mt-5"
                  >
                    <span>
                      {products.find((p) => p.id === product.productId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              {errors.products && (
                <p className="text-red-500">{errors.products.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="hover:text-red-500 text-slate-600 text-sm py-2 px-4 underline-offset-1"
              >
                Delete Recipe
              </button>
              <button
                onClick={notifyUpdate}
                type="submit"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
              >
                Update Recipe
              </button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <Link href="/meals">
                <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
                  Go back to Recipes
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditRecipe;
