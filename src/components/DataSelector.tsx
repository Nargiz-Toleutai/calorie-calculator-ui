import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

interface Data {
  name: string;
  value: number;
  options: number[];
  onChange: (event: SelectChangeEvent<number>) => void;
}

const DataSelector = ({ value, onChange, name, options }: Data) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 120,
        margin: "0",
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: "6px",

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "green",
          },
        },
      }}
      fullWidth
    >
      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        onChange={onChange}
      >
        <MenuItem
          value=""
          sx={{
            width: "100%",
          }}
        >
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "1px",
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DataSelector;
