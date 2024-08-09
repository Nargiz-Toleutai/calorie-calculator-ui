import { Control, FieldError } from "react-hook-form";

export interface CustomSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { id: number; name: string }[];
  error?: FieldError;
}
