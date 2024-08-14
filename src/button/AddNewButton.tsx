import Link from "next/link";
import { AddNewButtonProps } from "./types";

export const AddNewButton = ({ title }: AddNewButtonProps) => {
  return (
    <Link href={"/add-new-product"}>
      <button className="bg-green-500 flex justify-between items-center  text-white font-bold py-2 px-4 mt-5 mb-5 rounded-md hover:bg-green-700">
        {title}
      </button>
    </Link>
  );
};
