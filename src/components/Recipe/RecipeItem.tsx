import Link from "next/link";
// import RecipeButton from "../buttons/RecipeButton";
import { useRouter } from "next/router";
import { Category } from "./RecipeList";

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  products: Product[];
}

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
}

const RecipeItem = ({ name, category, products, id }: Recipe) => {
  const router = useRouter();

  //   const handleEditButton = () => {
  //     router.push(`/recipes/${id}`);
  //   };

  return (
    <li>
      <div>
        id={id}
        name={name}
        category={category.name}
        products={products.map((product) => product.name)}
      </div>
    </li>
  );
};

export default RecipeItem;
