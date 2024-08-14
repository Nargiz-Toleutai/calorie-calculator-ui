import { useState } from "react";
import { ProductWithUnitQuantity } from "./../models/product";
import ProductItem from "./Product/ProductItem";

interface SearchPanelProps {
  products: ProductWithUnitQuantity[];
  onSearch: (query: string) => void;
}

const SearchPanel = ({ products }: SearchPanelProps) => {
  const [inputValue, setValue] = useState<string>("");

  return (
    <div>
      <input
        className="search-input"
        type="text"
        placeholder="Search For Product..."
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
      />

      {products
        .filter((product) => {
          if (product.name.toLowerCase().includes(inputValue.toLowerCase())) {
            return true;
          } else {
            return false;
          }
        })
        .map((product) => (
          <ul key={product.id}>
            <ProductItem
              key={product.id}
              name={product.name}
              id={product.id}
              image={
                product.image
                  ? product.image
                  : "/backgroundImages/img-not-found.jpg"
              }
              unit={product.unit}
              quantity={product.quantity}
              protein={product.protein}
              carbs={product.carbs}
              fat={product.fat}
              calories={product.calories}
            />
          </ul>
        ))}
    </div>
  );
};

export default SearchPanel;
