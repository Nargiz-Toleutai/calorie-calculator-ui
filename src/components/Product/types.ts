import { ChangeEvent } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface CustomTextFieldProps {
  id: string;
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  helperText?: string;
  inputProps?: any;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ImageUploaderProps {
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  preview: string | ArrayBuffer | null;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export interface FormHeaderProps {
  title: string;
  authError: string | null;
}

export interface Product {
  id?: number;
  name: string;
  unit?: number;
  quantity?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}
