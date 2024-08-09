import { z } from "zod";

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

// types.ts
import {
  Control,
  FieldError,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";

export interface CustomTextFieldProps {
  id: string;
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  helperText?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  readOnly?: boolean;
}

export interface CustomSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { id: number; name: string }[];
  error?: FieldError;
}

export interface CustomChipProps {
  label?: string;
  onDelete: () => void;
}

export interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}
