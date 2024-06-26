import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const UserDataValidator = z
  .object({
    email: z.string().email().min(5, {
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
      const response = await fetch("http://localhost:3001/login", {
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
    <div className="login-page">
      <form className="login-window" onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          {...register("email")}
          className={`${errors.email ? "error-input" : ""}`}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className={`${errors.password ? "error-input" : ""}`}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <Link href="/forgot-password">
            <p>Forgot Password?</p>
          </Link>
        </div>
        <button type="submit" className="login-button mt-4">
          Sign in
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <h4>New user?</h4>
      <button>
        <Link href="/register">Create an account</Link>
      </button>
    </div>
  );
};

export default Login;
