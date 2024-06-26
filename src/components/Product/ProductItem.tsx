import Link from "next/link";
import ProductButton from "../buttons/ProductButton";
import { useRouter } from "next/router";

// interface RecipeComment {
//   rating: number;
// }

// const calculateAverageRating = (comments: RecipeComment[]): number => {
//   if (comments.length === 0) return 0;
//   const totalRating = comments.reduce(
//     (acc, comment) => acc + comment.rating,
//     0
//   );
//   return totalRating / comments.length;
// };

export interface Product {
  id: number;
  name: string;
  unit: number;
  quantity: number;
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
  quantity,
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
      {/* <ProductCard
        name: {name};
        unit: {unit};
        calories: {calories};
        image: {image};
      /> */}

      <div>
        <button onClick={handleEditButton}>Edit</button>
        <button onClick={handleEditButton}>Add to meal</button>
        <button>Delete</button>
      </div>
    </li>
  );
};

export default ProductItem;
