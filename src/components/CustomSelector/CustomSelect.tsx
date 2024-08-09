import { Controller } from "react-hook-form";
import {
  SelectPr,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { CustomSelectProps } from "./types";

const CustomSelect: React.FC<CustomSelectProps> = ({
  control,
  name,
  options,
  label,
  error,
  ...rest
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectPr
            {...field}
            {...rest}
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value.toString()}
          >
            <SelectTrigger className="w-full h-14 text-green-800 uppercase">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {options.map(({ name, id }) => (
                <SelectGroup key={id}>
                  <SelectItem value={id.toString()}>
                    <div className="text-gray-700 ml-2">{name}</div>
                  </SelectItem>
                </SelectGroup>
              ))}
            </SelectContent>
          </SelectPr>
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default CustomSelect;
