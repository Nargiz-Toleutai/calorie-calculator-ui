import Link from "next/link";

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
      <div className="border rounded-lg p-4 shadow-lg flex items-center bg-white bg-opacity-80 backdrop-blur font-medium transform transition-transform duration-300 hover:scale-105 relative group">
        <div className="relative">
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
      </div>
    </Link>
  );
};

export default ProductItem;
