import { SearchInputProps } from "./types";

const SearchInput = ({ onChange }: SearchInputProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      <input
        type="text"
        placeholder="Search anything..."
        className="w-1/3 p-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-20"
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
