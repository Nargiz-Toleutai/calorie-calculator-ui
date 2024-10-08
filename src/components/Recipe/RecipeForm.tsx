import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Recipe, RecipeFormProps, RecipeValidator } from "./types";
import FormWrapper from "../FormWrapper/FormWrapper";
import CustomSelect from "../CustomSelector/CustomSelect";
import CustomTextField from "../CustomTextField/CustomTextField";
import ProductSelector from "./ProductSelector";
import BackLink from "../BackLink/BackLink";
import DynamicButton from "@/button/DynamicButton";
import SelectedProductsChips from "./SelectProductsChips";

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
          <SelectedProductsChips
            selectedProducts={getValues("products")}
            products={products}
            onRemoveProduct={handleRemoveProduct}
          />

          <DynamicButton
            title={buttonText}
            color={"green"}
            hoverColor={"darkgreen"}
            type="submit"
          />
          <BackLink link={"/meals"} text={"Go back to recipes"} />
        </FormWrapper>
      </div>
    </div>
  );
};

export default RecipeForm;
