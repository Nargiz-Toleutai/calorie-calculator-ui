import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Layout from "@/components/Layout";

const UserDataValidator = z
  .object({
    email: z.string().email().toLowerCase().min(5, {
      message: "Email should have a minimum length of 5 characters",
    }),
    password: z.string().min(5, {
      message: "Password should have a minimum length of 5 characters",
    }),
  })
  .strict();

type User = z.infer<typeof UserDataValidator>;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserDataValidator),
  });

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      router.push("/");
    }
  }, [router]);

  const handleFormSubmit = async (data: User) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const result = await response.json();
      localStorage.setItem("token", result.token);
      console.log("Logged in");
      router.push("/");
    } catch (error) {
      console.error("Something went wrong!", error);
      setError(
        "Login failed. Please check your email or password and try again."
      );
    }
  };

  return (
    <Layout imgUrl="/background-images/login-page-background.jpg">
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center ">
        <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full backdrop-blur">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
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
                type="password"
                id="password"
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
            <div className="flex justify-between items-center mb-6">
              <Link href="/forgot-password">
                <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
                  Forgot Password?
                </span>
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign in
            </button>
            {error && (
              <p className="text-red-500 text-xs italic mt-2 text-center">
                {error}
              </p>
            )}
          </form>
          <div className="mt-6 text-center">
            <h4 className="text-gray-700">New user?</h4>
            <Link href="/register">
              <span className="text-green-600 hover:text-green-800 font-medium">
                Create an account
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
