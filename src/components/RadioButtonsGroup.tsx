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
}

const GreenRadio = styled(Radio)(({ theme }) => ({
  color: "green",
  "&.Mui-checked": {
    color: "green",
  },
}));

interface RadioButtonsGroupProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButtonsGroup: React.FC<RadioButtonsGroupProps> = ({
  value,
  onChange,
}) => {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        value={value}
        onChange={onChange}
        name="radio-buttons-group"
      >
        <FormControlLabel
          value="female"
          control={<GreenRadio />}
          label="Female"
        />
        <FormControlLabel value="male" control={<GreenRadio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonsGroup;
