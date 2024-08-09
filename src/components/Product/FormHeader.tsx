import { FormHeaderProps } from "./types";

const FormHeader: React.FC<FormHeaderProps> = ({ title, authError }) => (
  <div>
    <h1 className="text-2xl font-bold mb-6">{title}</h1>
    {authError && <p className="text-red-500">{authError}</p>}
  </div>
);

export default FormHeader;
