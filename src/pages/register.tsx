import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        router.push("/login");
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Registration</h1>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="text" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />
      {errors.password && (
        <p className="error-message">{errors.password.message}</p>
      )}
      <button type="submit">Register</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Register;
