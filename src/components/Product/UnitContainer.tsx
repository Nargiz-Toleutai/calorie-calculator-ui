import React from "react";
import RadioButtonsGroup from "../RadioButtonsGroup";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Product } from "./types";

interface UnitContainerProps {
  control: Control<Product>;
  product?: {
    unit?: string;
  };
  unitOptions: Array<{ label: string; value: string }>;
  errors: FieldErrors<Product>;
}

const UnitContainer = ({
  control,
  product,
  unitOptions,
  errors,
}: UnitContainerProps) => {
  return (
    <div>
      <label htmlFor="unit" className="block text-gray-700">
        Unit
      </label>
      <Controller
        name="unit"
        control={control}
        defaultValue={product?.unit ?? "g"}
        render={({ field }) => (
          <RadioButtonsGroup
            value={field.value}
            onChange={(event) => field.onChange(event.target.value)}
            options={unitOptions}
          />
        )}
      />
      {errors.unit && (
        <p className="text-red-500">{errors.unit.message as string}</p>
      )}
    </div>
  );
};

export default UnitContainer;
