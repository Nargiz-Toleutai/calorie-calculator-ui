import Link from "next/link";
import { PrimaryActionButtonProps } from "./types";

export const PrimaryActionButton = ({
  title,
  href,
}: PrimaryActionButtonProps) => {
  return (
    <Link href={href}>
      <button className="bg-green-500 text-white font-bold py-2 px-4 my-4 rounded-md hover:bg-green-700 md:py-2 md:px-4 sm:py-1 sm:px-2 sm:text-sm">
        {title}
      </button>
    </Link>
  );
};
