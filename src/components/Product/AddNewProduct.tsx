import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent, useMemo } from "react";
import {
  useForm,
  FieldError,
  Controller,
  ErrorOption,
  Field,
  FieldArray,
  FieldArrayPath,
  FieldErrors,
  FieldName,
  FieldRefs,
  FieldValues,
  FormState,
  InternalFieldName,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegisterReturn,
} from "react-hook-form";
import { notify } from "../../utils";
import { useRouter } from "next/router";
import CustomTextField from "../CustomTextField/CustomTextField";
import ImageUploader from "./ImageUploader";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";

import { Product, ProductValidator } from "./types";
import UnitContainer from "./UnitContainer";

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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      router.push("/login");
    }
  }, [router]);

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setFile(imageFile);

      const reader = new FileReader();
      reader.onload = () => {
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
    if (!file) return;
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

      notify("Product was added");
      router.push("/products");
      reset();
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
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 w-full max-w-md mt-24">
        <FormHeader title="Add New Product" authError={authError} />
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <CustomTextField
            id="name"
            label="Product Name"
            type="text"
            register={register("name")}
            error={errors.name}
            helperText={errors.name?.message}
          />

          <UnitContainer
            control={control}
            unitOptions={unitOptions}
            errors={errors}
            product={product}
          />

          <CustomTextField
            id="quantity"
            label="Quantity"
            type="number"
            register={register("quantity")}
            error={errors.quantity}
            helperText={errors.quantity?.message}
            readOnly
          />

          <CustomTextField
            id="protein"
            label="Protein"
            type="number"
            register={register("protein", { valueAsNumber: true })}
            error={errors.protein}
            helperText={errors.protein?.message}
            onChange={handleInputChange}
          />

          <CustomTextField
            id="carbs"
            label="Carbs"
            type="number"
            register={register("carbs")}
            error={errors.carbs}
            helperText={errors.carbs?.message}
            onChange={handleInputChange}
          />

          <CustomTextField
            id="fat"
            label="Fat"
            type="number"
            register={register("fat")}
            error={errors.fat}
            helperText={errors.fat?.message}
            onChange={handleInputChange}
          />

          {protein && carbs && fat ? (
            <CustomTextField
              id="calories"
              label="Calories"
              type="number"
              register={register("calories")}
              error={errors.calories}
              helperText={errors.calories?.message}
              readOnly
            />
          ) : (
            <></>
          )}

          <input id="portion" type="hidden" {...register("portion")} />

          <ImageUploader
            id="file"
            register={register("file")}
            error={errors.file as FieldError}
            preview={preview}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />

          <FormFooter />
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;
