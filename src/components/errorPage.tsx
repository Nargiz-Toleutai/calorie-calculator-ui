import Link from "next/link";

interface ErrorPageProps {
  error: string | null;
  page: string;
}

const ErrorPage = ({ error, page }: ErrorPageProps) => {
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

export default ErrorPage;
