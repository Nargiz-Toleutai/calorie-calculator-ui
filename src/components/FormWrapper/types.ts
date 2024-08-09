import { UseFormReturn } from "react-hook-form";

export interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}
