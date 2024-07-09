import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { green } from "@mui/material/colors";

import { Product } from "../Product/ProductItem";
import toast from "react-hot-toast";
import {
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Category {
  id: number;
  name: string;
  icon: string;
}

import { useRouter } from "next/router";
import Link from "next/link";

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

const notify = () => {
  toast.success("Recipe was added");
};

const AddNewRecipe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number }[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

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
    control,
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
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
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

        if (!responseCategories.ok || !responseProducts.ok) {
          throw new Error("Network response was not ok");
        }

        const resCategories = await responseCategories.json();
        const resProducts = await responseProducts.json();

        setCategories(resCategories);
        setProducts(resProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedProducts.length > 0 && selectedProducts[0]) {
      setValue("products", [selectedProducts[0], ...selectedProducts.slice(1)]);
    }
  }, [products, selectedProducts, setValue]);

  const onSubmitForm = async (data: Recipe) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes`,
        {
          method: "POST",
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
      setRecipes([...recipes, responseData]);
      router.push("/meals");
      reset();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleAddProduct = (productId: number) => {
    if (
      productId &&
      !selectedProducts.find((product) => product.productId === productId)
    ) {
      setSelectedProducts([...selectedProducts, { productId }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.productId !== productId)
    );
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
        {authError && <p className="text-red-500">{authError}</p>}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Recipe Name
            </label>
            <TextField
              id="name"
              type="text"
              {...register("name")}
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: "6px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-gray-700">
              Category
            </label>
            <TextField
              select
              id="categoryId"
              placeholder="Search for a category"
              {...register("categoryId", { valueAsNumber: true })}
              fullWidth
              variant="outlined"
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              sx={{
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: "6px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  value={category.id}
                  sx={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "1px",
                  }}
                >
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <label htmlFor="products" className="block text-gray-700">
              Products
            </label>
            <div className="mt-1">
              <Controller
                name="products"
                control={control}
                render={() => (
                  <Autocomplete
                    value={selectedProduct}
                    onChange={(event, newValue) => {
                      setSelectedProduct(newValue);
                      if (newValue && newValue.id !== undefined) {
                        handleAddProduct(newValue.id);
                      }
                    }}
                    options={products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search for a product"
                        error={!!errors.products}
                        helperText={errors.products?.message}
                        sx={{
                          backgroundColor: "white",
                          borderColor: "white",
                          borderRadius: "6px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white",
                            },
                            "&:hover fieldset": {
                              borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "green",
                            },
                          },
                        }}
                      />
                    )}
                    noOptionsText="No product found"
                  />
                )}
              />

              <List className="mt-2">
                {selectedProducts.map((product) => (
                  <ListItem
                    key={product.productId}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md mt-5"
                  >
                    <ListItemText
                      primary={
                        products.find((p) => p.id === product.productId)?.name
                      }
                      className="pl-2"
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="mr-1"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={notify}
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: green[500],
                "&:hover": {
                  backgroundColor: green[800],
                },
              }}
            >
              Save Recipe
            </Button>
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
  );
};

export default AddNewRecipe;
