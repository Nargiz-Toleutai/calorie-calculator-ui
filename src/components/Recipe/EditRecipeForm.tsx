import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Product } from "../../models/product";
import BackLink from "../BackLink/BackLink";
import CustomTextField from "../CustomTextField/CustomTextField";
import CustomSelect from "../CustomSelector/CustomSelect";
import ProductSelector from "./ProductSelector";
import SelectedProductsChips from "./SelectProductsChips";
import SubmitButton from "@/button/SubmitButton";
import FormWrapper from "../FormWrapper/FormWrapper";

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface SelectedProduct {
  productId: number;
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

const notifyUpdate = () => {
  toast.success("Recipe was updated");
};

const notifyDelete = () => {
  toast.success("Recipe was deleted");
};

interface EditRecipeFormProps {
  id: string;
  recipe: Recipe;
  products: Product[];
  categories: Category[];
  defaultSelectedProducts: SelectedProduct[];
  defaultCategoryId: number;
}

const EditRecipeForm = ({
  id,
  recipe,
  products,
  categories,
  defaultSelectedProducts,
  defaultCategoryId,
}: EditRecipeFormProps) => {
  const form = useForm<Recipe>({
    resolver: zodResolver(RecipeValidator),
    defaultValues: {
      name: recipe.name,
      categoryId: defaultCategoryId,
      products: defaultSelectedProducts,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = form;

  const router = useRouter();

  const [searchField, setSearchField] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    defaultSelectedProducts
  );

  const onSubmitForm = async (data: Recipe) => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      await response.json();
      notifyUpdate();
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
      setValue("products", updatedProducts);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.productId !== productId
    );
    setSelectedProducts(updatedProducts);
    setValue("products", updatedProducts);
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

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
    <FormWrapper form={form} onSubmit={handleSubmit(onSubmitForm)}>
      <CustomTextField
        id="name"
        label="Recipe Name"
        type="text"
        register={form.register("name")}
        error={errors.name}
        helperText={errors.name?.message}
      />

      <CustomSelect
        control={form.control}
        name="categoryId"
        label="Category"
        options={categories}
        error={errors.categoryId}
      />

      <div>
        <ProductSelector
          products={products}
          selectedProducts={getValues("products") || []}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
          error={errors.products?.message}
          searchField={searchField}
          setSearchField={setSearchField}
        />
        <SelectedProductsChips
          selectedProducts={getValues("products")}
          products={products}
          onRemoveProduct={handleRemoveProduct}
        />
      </div>

      <div className="flex justify-between">
        <SubmitButton
          title={"Delete Recipe"}
          color={"red"}
          hoverColor={"darkred"}
        />
        <SubmitButton
          title={"Update Recipe"}
          color={"green"}
          hoverColor={"darkgreen"}
        />
      </div>
      <BackLink link={"/meals"} text={" Go back to Recipes"} />
    </FormWrapper>
  );
};

export default EditRecipeForm;
