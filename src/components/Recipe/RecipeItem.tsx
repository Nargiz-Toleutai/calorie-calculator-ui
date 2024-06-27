import { useRouter } from "next/router";
import { Category } from "./RecipeList";
import { Product } from "../Product/ProductItem";

export interface Recipe {
  id: number;
  name: string;
  category?: Category;
  products: Product[];
}

const RecipeItem = ({ name, category, products, id }: Recipe) => {
  const router = useRouter();

  const handleEditButton = () => {
    router.push(`/recipes/${id}`);
  };

  return (
    <li>
      <div>
        id={id}
        name={name}
        products={products.map((product) => product.name)}
      </div>
      <button onClick={handleEditButton}>Edit</button>
    </li>
  );
};

export default RecipeItem;
