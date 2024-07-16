import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { green } from "@mui/material/colors";
import toast from "react-hot-toast";
import { TextField, Button, Chip, Box } from "@mui/material";

import { useRouter } from "next/router";
import Link from "next/link";
import { Form, FormControl, FormField } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronDown } from "lucide-react";
import {
  SelectPr,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { cn } from "../../lib/utils";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "../ui/command";

export interface Product {
  id: number;
  name: string;
  unit?: number;
  quantity?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

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
      .min(1, { message: "At least one product must be selected" }),
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
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchField, setSearchField] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authError) {
      router.push("/login");
    }
  }, [authError, router]);

  const form = useForm<Recipe>({
    resolver: zodResolver(RecipeValidator),
    defaultValues: {
      name: "",
      categoryId: 1,
      products: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    trigger,
    formState: { errors },
  } = form;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
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
  }, []);

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
      const updatedProducts = [...selectedProducts, { productId }];
      setSelectedProducts(updatedProducts);
      setValue("products", updatedProducts, { shouldValidate: true });
      trigger("products");
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.productId !== productId
    );
    setSelectedProducts(updatedProducts);
    setValue("products", updatedProducts, { shouldValidate: true });
    trigger("products");
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
        {authError && <p className="text-red-500">{authError}</p>}
        <Form {...form}>
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
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <SelectPr
                    {...field}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-full h-14 text-green-800 uppercase">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map(({ name, id }) => (
                        <SelectGroup key={id}>
                          <SelectItem value={id.toString()}>
                            <div className="text-gray-700 ml-2">{name}</div>
                          </SelectItem>
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </SelectPr>
                )}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId?.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="products" className="block text-gray-700">
                Ingredients
              </label>
              <FormField
                control={control}
                name="products"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <button
                          className={cn(
                            "flex flex-row items-center justify-between uppercase bg-white border-none text-green-700 w-full h-14 px-3 py-2 hover:bg-white hover:border-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span>Select Ingredients</span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search ingredient..."
                            value={searchField}
                            onValueChange={setSearchField}
                          />
                          <CommandEmpty>No ingredient found.</CommandEmpty>
                          <CommandGroup>
                            {products.map((product) => (
                              <CommandItem
                                data-disabled="false"
                                value={product.name}
                                key={product.id}
                                onSelect={() => handleAddProduct(product.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    getValues("products")?.find(
                                      (pId) => pId.productId === product.id
                                    )
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {product.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {getValues("products")?.map(({ productId }) => {
                  const product = products.find((p) => p.id === productId);
                  return (
                    <Chip
                      key={productId}
                      label={product?.name}
                      onDelete={() => handleRemoveProduct(productId)}
                      sx={{
                        backgroundColor: "white",
                        borderColor: "green",
                        borderRadius: "4px",
                        "& .MuiChip-deleteIcon": {
                          color: "red",
                        },
                      }}
                    />
                  );
                })}
                {errors.products && (
                  <span className="text-red-600">
                    {errors.products?.message}
                  </span>
                )}
              </Box>
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
        </Form>
      </div>
    </div>
  );
};

export default AddNewRecipe;
