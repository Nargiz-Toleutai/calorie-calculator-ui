import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { Box, Chip } from "@mui/material";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "../ui/command";
import { FormControl, FormField } from "../ui/form";
import { cn } from "../../lib/utils";
import { ProductSelectorProps } from "./types";

const ProductSelector = ({
  products,
  selectedProducts,
  onAddProduct,
  onRemoveProduct,
  error,
}: ProductSelectorProps) => {
  const [searchField, setSearchField] = useState("");

  return (
    <div>
      <label htmlFor="products" className="block text-gray-700">
        Ingredients
      </label>
      <FormField
        name="products"
        render={() => (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  className={cn(
                    "flex flex-row items-center justify-between uppercase bg-white border-none text-green-700 w-full h-14 px-3 py-2 hover:bg-white hover:border-none"
                  )}
                >
                  <span>Select Ingredients</span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput
                    placeholder="Search ingredient..."
                    value={searchField}
                    onValueChange={setSearchField}
                  />
                  <CommandEmpty>No ingredient found.</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => (
                      <CommandItem
                        data-disabled="false"
                        value={product.name}
                        key={product.id}
                        onSelect={() => onAddProduct(product.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProducts.find(
                              (p) => p.productId === product.id
                            )
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {product.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
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
        {error && <span className="text-red-600">{error}</span>}
      </Box>
    </div>
  );
};

export default ProductSelector;
