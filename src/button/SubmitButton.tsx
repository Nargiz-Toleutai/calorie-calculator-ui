import { Button } from "@mui/material";
import { SubmitButtonProps } from "./types";

const SubmitButton = ({ title, color, hoverColor }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        sx={{
          backgroundColor: `${color}`,
          "&:hover": {
            backgroundColor: `${hoverColor}`,
          },
        }}
      >
        {title}
      </Button>
    </div>
  );
};

export default SubmitButton;
