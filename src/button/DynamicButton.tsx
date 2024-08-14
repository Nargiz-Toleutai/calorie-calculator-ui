import { Button } from "@mui/material";
import { DynamicButtonProps } from "./types";

const DynamicButton = ({
  title,
  type = "button",
  color = "green[500]",
  hoverColor = "green[800]",
  onClick,
}: DynamicButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        type={type}
        variant="contained"
        color="secondary"
        onClick={onClick}
        sx={{
          backgroundColor: color,
          "&:hover": {
            backgroundColor: hoverColor,
          },
        }}
      >
        {title}
      </Button>
    </div>
  );
};

export default DynamicButton;
