import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/material";

interface RadioButtonsGroupProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
}

const GreenRadio = styled(Radio)(({ theme }) => ({
  color: "green",
  "&.Mui-checked": {
    color: "green",
  },
}));

const RadioButtonsGroup: React.FC<RadioButtonsGroupProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="radio-buttons-group-label"
        value={value}
        onChange={onChange}
        name="radio-buttons-group"
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<GreenRadio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonsGroup;
