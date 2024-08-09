import { FieldError, UseFormRegisterReturn } from "react-hook-form";

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
