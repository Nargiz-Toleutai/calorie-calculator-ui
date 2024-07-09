import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { date, z } from "zod";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";

const ProductValidator = z
  .object({
    id: z.number().int(),
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    unit: z.string().min(1, { message: "Unit should not be empty" }),
    quantity: z.number().min(0, { message: "Quantity should be non-negative" }),
    protein: z.number().min(0, { message: "Protein should be non-negative" }),
    carbs: z.number().min(0, { message: "Carbs should be non-negative" }),
    fat: z.number().min(0, { message: "Fat should be non-negative" }),
    calories: z.number().min(0, { message: "Calories should be non-negative" }),
    image: z.string().url({ message: "Invalid URL" }).optional(),
  })
  .strict();

export type Product = z.infer<typeof ProductValidator>;

const notifyUpdate = () => {
  toast.success("Product was updated");
};

const notifyDelete = () => {
  toast.success("Product was deleted ❌");
};

const EditProduct = () => {
  const [data, setData] = useState<Product>();
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (authError) {
      router.push("/login");
    }
  }, [authError, router]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(ProductValidator),
    defaultValues: {
      name: "",
      unit: "",
      quantity: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      image: "",
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
        const responseProduct = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!responseProduct.ok) {
          throw new Error("Network response was not ok");
        }

        const resProduct = await responseProduct.json();
        setData(resProduct);
        reset({
          name: resProduct.name,
          unit: resProduct.unit,
          quantity: resProduct.quantity,
          protein: resProduct.protein,
          carbs: resProduct.carbs,
          fat: resProduct.fat,
          calories: resProduct.calories,
          image: resProduct.image,
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };

    fetchData();
  }, [token, reset, id]);

  const onSubmitForm = async (data: Product) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();
      console.log("Product was changed", responseData);
      notifyUpdate();
      router.push("/products");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      notifyDelete();
      router.push("/products");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
    <Layout imgUrl="/background-images/account-page-background.jpg">
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center pt-32">
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          {authError && <p className="text-red-500">{authError}</p>}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue={data?.name}
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
              <label htmlFor="unit" className="block text-gray-700">
                Unit
              </label>
              <input
                id="unit"
                type="text"
                {...register("unit")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.unit ? "border-red-500" : ""
                }`}
              />
              {errors.unit && (
                <p className="text-red-500">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-gray-700">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                {...register("quantity")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.quantity ? "border-red-500" : ""
                }`}
              />
              {errors.quantity && (
                <p className="text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="protein" className="block text-gray-700">
                Protein
              </label>
              <input
                id="protein"
                type="number"
                {...register("protein")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.protein ? "border-red-500" : ""
                }`}
              />
              {errors.protein && (
                <p className="text-red-500">{errors.protein.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="carbs" className="block text-gray-700">
                Carbs
              </label>
              <input
                id="carbs"
                type="number"
                {...register("carbs")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.carbs ? "border-red-500" : ""
                }`}
              />
              {errors.carbs && (
                <p className="text-red-500">{errors.carbs.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="fat" className="block text-gray-700">
                Fat
              </label>
              <input
                id="fat"
                type="number"
                {...register("fat")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.fat ? "border-red-500" : ""
                }`}
              />
              {errors.fat && (
                <p className="text-red-500">{errors.fat.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="calories" className="block text-gray-700">
                Calories
              </label>
              <input
                id="calories"
                type="number"
                {...register("calories")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.calories ? "border-red-500" : ""
                }`}
              />
              {errors.calories && (
                <p className="text-red-500">{errors.calories.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700">
                Image URL
              </label>
              <input
                id="image"
                type="url"
                {...register("image")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.image ? "border-red-500" : ""
                }`}
              />
              {errors.image && (
                <p className="text-red-500">{errors.image.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="hover:text-red-500 text-slate-600 text-sm py-2 px-4 underline-offset-1"
              >
                Delete Product
              </button>
              <button
                onClick={notifyUpdate}
                type="submit"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
              >
                Update Product
              </button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <Link href="/products">
                <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
                  Go back to Products
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
