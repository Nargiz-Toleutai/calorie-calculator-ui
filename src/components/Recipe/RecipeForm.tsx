import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { Recipe, RecipeValidator } from "./types";
import FormWrapper from "../FormWrapper/FormWrapper";
import CustomSelect from "../CustomSelector/CustomSelect";
import CustomTextField from "../CustomTextField/CustomTextField";
import ProductSelector from "./ProductSelector";
import { Category } from "../../models/category";
import { Product } from "../../models/product";

interface RecipeFormProps {
  initialValues?: Partial<Recipe>;
  categories: Category[];
  products: Product[];
  onSubmit: (data: Recipe) => Promise<void>;
  buttonText: string;
  recipeId?: string;
}

const RecipeForm = ({
  initialValues = { name: "", categoryId: 1, products: [] },
  categories,
  products,
  onSubmit,
  buttonText,
}: RecipeFormProps) => {
  const form = useForm<Recipe>({
    resolver: zodResolver(RecipeValidator),
    defaultValues: initialValues,
  });

  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;

  const handleAddProduct = (productId: number) => {
    const selectedProducts = getValues("products") || [];
    if (!selectedProducts.find((product) => product.productId === productId)) {
      const updatedProducts = [...selectedProducts, { productId }];
      setValue("products", updatedProducts, { shouldValidate: true });
      trigger("products");
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedProducts = getValues("products").filter(
      (product) => product.productId !== productId
    );
    setValue("products", updatedProducts, { shouldValidate: true });
    trigger("products");
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">{buttonText}</h1>
        <FormWrapper form={form} onSubmit={form.handleSubmit(onSubmit)}>
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

          <ProductSelector
            products={products}
            selectedProducts={getValues("products") || []}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            error={errors.products?.message}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              }}
            >
              {buttonText}
            </Button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default RecipeForm;
