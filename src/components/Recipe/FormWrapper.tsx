import { FormProvider, UseFormReturn } from "react-hook-form";
import { FormWrapperProps } from "./types";

const FormWrapper: React.FC<FormWrapperProps> = ({
  form,
  onSubmit,
  children,
}) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
