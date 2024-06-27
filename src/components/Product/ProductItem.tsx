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
  onClick?: () => void;
}

const ProductItem = ({
  name,
  unit,
  protein,
  carbs,
  fat,
  calories,
  image,
  id,
}: Product) => {
  const router = useRouter();

  const handleEditButton = () => {
    router.push(`/products/${id}`);
  };

  return (
    <li>
      <div>
        <p>name: {name}</p>
        <p>unit: {unit}</p>
        <p>protein: {protein}</p>
        <p>carbs: {carbs}</p>
        <p>fat: {fat}</p>
        <p>calories: {calories}</p>
        <p>image: {image}</p>
      </div>
      <div>
        <button onClick={handleEditButton}>Edit</button>
        <button>Delete</button>
      </div>
    </li>
  );
};

export default ProductItem;
