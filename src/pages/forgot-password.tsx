import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setMessage("Password reset link sent to your email.");
        reset();
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <Layout imgUrl="/background-images/login-page-background.jpg">
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="w-full max-w-md p-8 bg-opacity-80 shadow-md rounded-lg bg-gray-100 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Forgot your password?</h2>
          <p className="mb-4">
            Do not worry, it happens. Let us know the email address you signed
            up with and we will send you an email with instructions.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-800 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Send Reset Link
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
          <Link href="/login">
            <p className="mt-4 text-sm text-blue-500 hover:underline">
              ← Back to Login
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
