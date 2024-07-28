import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useForm, FieldError, Controller } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, TextField } from "@mui/material";
import RadioButtonsGroup from "./../../components/RadioButtonsGroup";
import Layout from "@/components/Layout";
import { green } from "@mui/material/colors";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ProductValidator = z
  .object({
    id: z.number().int().optional(),
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    unit: z.string().min(1, { message: "Unit should not be empty" }),
    quantity: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Quantity should be non-negative" })
    ),
    protein: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Protein should be non-negative" })
    ),
    carbs: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Carbs should be non-negative" })
    ),
    fat: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Fat should be non-negative" })
    ),
    calories: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Calories should be non-negative" })
    ),
    portion: z.preprocess(() => 0, z.number().min(0).default(0)),
    image: z
      .any()
      .optional()
      .refine(
        (files) => !files?.length || files[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        (files) =>
          !files?.length || ACCEPTED_IMAGE_MIME_TYPES.includes(files[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  })
  .strict();

export type Product = z.infer<typeof ProductValidator>;

const notify = (message: string) => {
  toast.success(message);
};

const EditProduct = () => {
  const [product, setProduct] = useState<Product>();
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [image, setImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (authError) {
      router.push("/login");
    }
  }, [authError, router]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(ProductValidator),
    defaultValues: {
      portion: 0,
      quantity: 100,
    },
  });

  console.log({ errors });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }

        const data = await response.json();
        setProduct(data);

        reset({ ...data, image: undefined });
        setPreview(`${process.env.NEXT_PUBLIC_API_URL}${data.image}`);
      } catch (error) {
        console.error("Failed to fetch product data", error);
      }
    };

    fetchProduct();
  }, [id, token, reset]);

  const protein = watch("protein");
  const carbs = watch("carbs");
  const fat = watch("fat");

  useEffect(() => {
    const calculateCalories = () => {
      const calories = Math.floor(protein * 4 + carbs * 4 + fat * 9);
      setValue("calories", calories);
    };

    if (protein && carbs && fat) {
      calculateCalories();
    }
  }, [protein, carbs, fat, setValue]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    setPreview(null);
  };

  const onSubmitForm = async (data: Product) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("quantity", data.quantity.toString());
    formData.append("protein", parseFloat(data.protein.toString()).toString());
    formData.append("carbs", parseFloat(data.carbs.toString()).toString());
    formData.append("fat", parseFloat(data.fat.toString()).toString());
    formData.append("calories", data.calories.toString());
    formData.append("portion", data.portion.toString());
    if (image !== undefined) formData.append("image", image);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      notify("Product was updated");
      router.push("/products");
      reset();
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      notify("Product was deleted");
      router.push("/products");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const unitOptions = [
    { label: "grams", value: "g" },
    { label: "liters", value: "l" },
  ];

  console.log({ errors });

  return (
    <Layout imgUrl="/background-images/register-page-background.jpg">
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center">
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 w-full overscroll-contain max-w-md mt-24">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          {authError && <p className="text-red-500">{authError}</p>}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Product Name
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
                  m: 1,
                  minWidth: 120,
                  margin: "0",
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
              <label htmlFor="unit" className="block text-gray-700">
                Unit
              </label>
              <Controller
                name="unit"
                control={control}
                defaultValue={product?.unit ?? "g"}
                render={({ field }) => (
                  <RadioButtonsGroup
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    options={unitOptions}
                  />
                )}
              />
              {errors.unit && (
                <p className="text-red-500">{errors.unit.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-gray-700">
                Quantity
              </label>
              <TextField
                id="quantity"
                type="number"
                {...register("quantity")}
                fullWidth
                variant="outlined"
                inputProps={{ step: "0.1", min: "0", max: "1000" }}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
            </div>

            <div>
              <label htmlFor="protein" className="block text-gray-700">
                Protein
              </label>
              <TextField
                id="protein"
                type="number"
                inputProps={{ step: 0.01 }}
                {...register("protein", { valueAsNumber: true })}
                fullWidth
                variant="outlined"
                error={!!errors.protein}
                helperText={errors.protein?.message}
                sx={{
                  backgroundColor: "white",
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
              <label htmlFor="carbs" className="block text-gray-700">
                Carbs
              </label>
              <TextField
                id="carbs"
                type="number"
                inputProps={{ step: 0.01 }}
                {...register("carbs")}
                fullWidth
                variant="outlined"
                error={!!errors.carbs}
                helperText={errors.carbs?.message}
                sx={{
                  backgroundColor: "white",
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
              <label htmlFor="fat" className="block text-gray-700">
                Fat
              </label>
              <TextField
                id="fat"
                type="number"
                inputProps={{ step: 0.01 }}
                {...register("fat")}
                fullWidth
                variant="outlined"
                error={!!errors.fat}
                helperText={errors.fat?.message}
                sx={{
                  backgroundColor: "white",
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

            {protein && carbs && fat ? (
              <div>
                <label htmlFor="calories" className="block text-gray-700">
                  Calories
                </label>
                <TextField
                  id="calories"
                  type="number"
                  {...register("calories")}
                  fullWidth
                  variant="outlined"
                  error={!!errors.calories}
                  helperText={errors.calories?.message}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "transparent",
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <></>
            )}

            <input id="portion" type="hidden" {...register("portion")} />

            <div>
              <label htmlFor="image" className="block text-gray-700">
                <span className="sr-only">Choose file</span>
                <input
                  id="image"
                  type="file"
                  {...register("image")}
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100
                          "
                />
              </label>

              {errors.image && (
                <p className="text-red-500">
                  {(errors.image as FieldError).message}
                </p>
              )}
            </div>
            {preview && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview as string}
                  alt="Image Preview"
                  className="w-full h-auto rounded-md"
                  height={200}
                  width={200}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-block align-baseline font-medium text-sm text-red-600 hover:text-red-800"
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleDelete}
                sx={{
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
              >
                Delete Recipe
              </Button>

              <Button
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
                Update Product
              </Button>
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
