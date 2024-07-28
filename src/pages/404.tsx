import Layout from "@/components/Layout";
import Link from "next/link";

interface Error404PageProps {
  error: string | null;
  page: string;
}

const Error404Page = ({ error, page }: Error404PageProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-red-500 flex justify-center">
        {error}
      </h1>
      <Link
        href={page}
        className="text-green-500 text-sm flex justify-center underline"
      >
        Go back to meals
      </Link>
    </>
  );
};

export default Error404Page;
