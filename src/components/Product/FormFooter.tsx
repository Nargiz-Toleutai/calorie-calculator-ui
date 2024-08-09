import Link from "next/link";

const FormFooter: React.FC = () => (
  <div>
    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
      >
        Add Product
      </button>
    </div>
    <div className="flex justify-between items-center mb-6">
      <Link href="/products">
        <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
          Go back to Products
        </span>
      </Link>
    </div>
  </div>
);

export default FormFooter;
