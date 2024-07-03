import Link from "next/link";
import { useRouter } from "next/router";

export interface Product {
  id: number;
  name: string;
  unit: number;
  quantity?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}

type ProductItemProps = Product & { onClick?: () => void };

const ProductItem: React.FC<Product> = ({
  id,
  name,
  unit,
  protein,
  carbs,
  fat,
  calories,
  image,
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg flex flex-col items-center">
      <img src={image} alt={name} className="w-32 h-32 object-cover mb-4" />
      <h2 className="text-lg font-bold mb-2">{name}</h2>
      <p className="text-gray-500">{unit}</p>
      <p className="text-gray-500">{protein}g Protein</p>
      <p className="text-gray-500">{carbs}g Carbs</p>
      <p className="text-gray-500">{fat}g Fat</p>
      <p className="text-gray-500">{calories} Kcal</p>
    </div>
  );
};

export default ProductItem;
