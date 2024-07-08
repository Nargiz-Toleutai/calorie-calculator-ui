import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";

const UserDataValidator = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
  })
  .strict();

type RegisterFormData = z.infer<typeof UserDataValidator>;

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserDataValidator),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (response.status === 201) {
        router.push("/");
      } else if (response.status === 409) {
        setError("User already exists. Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(responseData.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setError("Something went wrong");
    }
  };

  return (
    <Layout imgUrl="/background-images/login-page-background.jpg">
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center ">
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full backdrop-blur">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Registration
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
            {error && (
              <p className="text-red-500 text-xs italic mt-2 text-center">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
