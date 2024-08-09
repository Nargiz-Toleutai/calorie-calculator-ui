import { TextField } from "@mui/material";
import { CustomTextFieldProps } from "../Product/types";

const CustomTextField = ({
  id,
  label,
  type,
  register,
  error,
  helperText,
  inputProps,
  readOnly,
}: CustomTextFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <TextField
        id={id}
        type={type}
        fullWidth
        variant="outlined"
        error={!!error}
        helperText={helperText}
        inputProps={inputProps}
        InputProps={{ readOnly }}
        {...register}
        sx={{
          backgroundColor: readOnly ? "transparent" : "white",
          borderRadius: "6px",
          border: readOnly ? "none" : "1px solid white",
          boxShadow: readOnly ? "none" : "default",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: readOnly ? "transparent" : "white",
            },
            "&:hover fieldset": {
              borderColor: readOnly ? "transparent" : "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "green",
            },
          },
        }}
      />
    </div>
  );
};

export default CustomTextField;
