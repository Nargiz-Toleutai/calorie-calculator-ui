import Link from "next/link";
import { useRouter } from "next/router";

export interface Product {
  id?: number;
  name: string;
  unit?: number;
  quantity?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  image: string;
}

type ProductItemProps = Product & { onClick?: () => void };

const ProductItem = ({
  id,
  name,
  unit,
  protein,
  carbs,
  fat,
  calories,
  image,
}: Product) => {
  return (
    <Link href={`/edit-product/${id}`} className="justify-end">
      <div className="border rounded-lg p-4 shadow-lg flex flex-col items-center bg-white bg-opacity-80 backdrop-blur font-medium transform transition-transform duration-300 hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 object-cover mb-4 rounded-lg"
        />
        <h2 className="text-lg font-bold mb-2">{name}</h2>
        <p className="text-green-500 font-bold">
          {protein} {unit} Protein
        </p>
        <p className="text-red-500">
          {carbs} {unit} Carbs
        </p>
        <p className="text-yellow-500">
          {fat} {unit} Fat
        </p>
        <p className="text-gray-500">{calories} Kcal</p>
      </div>
    </Link>
  );
};

export default ProductItem;
