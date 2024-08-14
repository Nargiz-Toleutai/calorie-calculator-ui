import React from "react";
import { Box, Chip } from "@mui/material";
import { SelectedProductsChipsProps } from "./types";

const SelectedProductsChips = ({
  selectedProducts,
  products,
  onRemoveProduct,
}: SelectedProductsChipsProps) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
      {selectedProducts.map(({ productId }) => {
        const product = products.find((p) => p.id === productId);
        return (
          <Chip
            key={productId}
            label={product?.name}
            onDelete={() => onRemoveProduct(productId)}
            sx={{
              backgroundColor: "white",
              borderColor: "green",
              borderRadius: "4px",
              "& .MuiChip-deleteIcon": {
                color: "red",
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default SelectedProductsChips;
