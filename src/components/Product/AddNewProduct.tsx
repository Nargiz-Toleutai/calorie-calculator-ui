import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent, useMemo } from "react";
import { useForm, FieldError, Controller } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import { TextField } from "@mui/material";
import RadioButtonsGroup from "../RadioButtonsGroup";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ProductValidator = z
  .object({
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
    file: z
      .any()
      .optional()
      .refine((files) => {
        console.log({ f: files.length, files });
        return !files?.length || files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine(
        (files) =>
          !files?.length ||
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  })
  .strict();

export type Product = z.infer<typeof ProductValidator>;

const notify = () => {
  toast.success("Product was added");
};

const AddNewProduct = () => {
  const [product, setProduct] = useState<Product>();
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const router = useRouter();

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

  const protein = watch("protein");
  const carbs = watch("carbs");
  const fat = watch("fat");

  const calories = useMemo(() => {
    if (protein && carbs && fat) {
      return Math.floor(protein * 4 + carbs * 4 + fat * 9);
    }
    return 0;
  }, [carbs, fat, protein]);

  useEffect(() => {
    setValue("calories", calories);
  }, [calories, setValue]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setFile(imageFile);

      const reader = new FileReader();
      reader.onload = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(undefined);
    setPreview(null);
  };

  const onSubmitForm = async (data: Product) => {
    if (typeof file === "undefined") return;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("quantity", data.quantity.toString());
    formData.append("protein", data.protein.toString());
    formData.append("carbs", data.carbs.toString());
    formData.append("fat", data.fat.toString());
    formData.append("calories", data.calories.toString());
    formData.append("portion", data.portion.toString());
    formData.append("image", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      notify();
      router.push("/products");
      reset();

      console.log("Product was added", response.body);
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const unitOptions = [
    { label: "grams", value: "g" },
    { label: "liters", value: "l" },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.replace(",", ".");
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 w-full overscroll-contain max-w-md mt-24">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
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
              inputProps={{ step: 0.01 }}
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
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              {...register("fat")}
              fullWidth
              variant="outlined"
              error={!!errors.fat}
              helperText={errors.fat?.message}
              inputProps={{ step: 0.01 }}
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
            <label htmlFor="file" className="block text-gray-700">
              <span className="sr-only">Choose file</span>
              <input
                id="file"
                type="file"
                {...register("file")}
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

            {errors.file && (
              <p className="text-red-500">
                {(errors.file as FieldError).message}
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
                height={50}
                width={50}
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
            >
              Add Product
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
  );
};

export default AddNewProduct;
