import { z } from "zod";
import { Product } from "../../models/product";

export const RecipeValidator = z
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

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface SelectedProduct {
  productId: number;
}

export interface ProductSelectorProps {
  products: Product[];
  selectedProducts: { productId: number }[];
  onAddProduct: (productId: number) => void;
  onRemoveProduct: (productId: number) => void;
  error?: string;
}
