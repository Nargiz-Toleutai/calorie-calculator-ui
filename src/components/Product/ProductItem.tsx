import Link from "next/link";
import React from "react";
import { ProductWithUnitQuantity } from "../../models/product";
import MacroInfo from "./MacroInfo";

const ProductItem = React.memo(
  ({
    id,
    name,
    unit,
    protein,
    carbs,
    fat,
    calories,
    image,
  }: ProductWithUnitQuantity) => {
    return (
      <Link href={`/edit-product/${id}`} className="justify-end">
        <div className="border rounded-lg p-4 shadow-lg flex items-center bg-white bg-opacity-80 backdrop-blur font-medium transform transition-transform duration-300 hover:scale-105 relative group">
          <div className="relative">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={image}
              alt={name}
              className="w-48 h-48 object-cover rounded-lg group-hover:opacity-30 transition-opacity duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="bg-green-500 text-white text-lg font-bold py-2 px-4 rounded-lg">
                Edit
              </div>
            </div>
          </div>
          <div className="ml-6 flex flex-col items-start">
            <h2 className="text-lg font-bold mb-2">{name}</h2>
            <MacroInfo
              value={protein}
              unit={unit}
              label="Protein"
              color="green-500"
            />
            <MacroInfo
              value={carbs}
              unit={unit}
              label="Carbs"
              color="red-500"
            />
            <MacroInfo
              value={fat}
              unit={unit!}
              label="Fat"
              color="yellow-500"
            />
            <p className="text-gray-500 font-bold">{calories} Kcal</p>
          </div>
        </div>
      </Link>
    );
  }
);

ProductItem.displayName = "ProductItem";

export default ProductItem;
