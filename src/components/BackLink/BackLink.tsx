import Link from "next/link";
import { BackLinkProps } from "./types";

const BackLink = ({ link, text }: BackLinkProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link href={link}>
        <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
          {text}
        </span>
      </Link>
    </div>
  );
};

export default BackLink;
