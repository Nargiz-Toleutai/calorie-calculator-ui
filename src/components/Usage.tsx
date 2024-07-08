import React, { useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Framework {
  value: string;
  label: string;
}

const frameworks: Framework[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function ComboboxDemo() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [value, setValue] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSelect = (framework: string) => {
    setValue(value === framework ? "" : framework);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
        {value
          ? frameworks.find((fw) => fw.value === value)?.label
          : "Select framework..."}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          {frameworks.map((framework) => (
            <ListItem
              button
              key={framework.value}
              onClick={() => handleSelect(framework.value)}
            >
              <Checkbox checked={value === framework.value} />
              <ListItemText primary={framework.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
