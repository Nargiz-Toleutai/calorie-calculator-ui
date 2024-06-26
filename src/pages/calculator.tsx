import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserIdFromToken } from "@/utils";

const AdditionalUserDataValidator = z
  .object({
    weight: z.preprocess(
      (val) => Number(val),
      z.number().min(40, { message: "Weight should be a minimum of 40kg" })
    ),
    height: z.preprocess(
      (val) => Number(val),
      z.number().min(30, { message: "Height should be a minimum of 30cm" })
    ),
    age: z.preprocess(
      (val) => Number(val),
      z.number().min(18, { message: "Age should be a minimum of 18" })
    ),
    gender: z.preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      z.boolean({ message: "Gender is required" })
    ),
    activityLevel: z.preprocess(
      (val) => Number(val),
      z.number().min(1, { message: "Activity level should be a minimum of 1" })
    ),
    targetDeficitPercent: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, { message: "Deficit percentage should be a minimum of 0" })
    ),
  })
  .strict();

export type User = z.infer<typeof AdditionalUserDataValidator>;

const Calculator = () => {
  const [data, setData] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(AdditionalUserDataValidator),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user_info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        console.log("Fetched data:", res);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!authError) return;

    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [authError, router]);

  const handleUpdateData = async (formData: User) => {
    console.log({ formData });
    if (!token) return;
    try {
      const response = await fetch(
        `http://localhost:3001/user/${getUserIdFromToken(token)}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to update user data");
        return;
      }

      const result = await response.json();
      setData(result);
      console.log("Information updated");
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  };

  if (authError) {
    return (
      <Layout>
        <div>{authError}</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="progress-page">
        <h1>Your information</h1>
        <form onSubmit={handleSubmit(handleUpdateData)}>
          <label htmlFor={"weight"}>Weight</label>
          <input
            type="number"
            id={"weight"}
            className={`${errors.weight ? "error-input" : ""}`}
            defaultValue={data.weight}
            {...register("weight")}
            min={40}
          />
          {errors.weight && (
            <p className="error-message">{errors.weight.message}</p>
          )}

          <label htmlFor={"height"}>Height</label>
          <input
            type="number"
            id={"height"}
            className={`${errors.height ? "error-input" : ""}`}
            defaultValue={data.height}
            {...register("height")}
            min={30}
          />
          {errors.height && (
            <p className="error-message">{errors.height.message}</p>
          )}

          <label htmlFor={"age"}>Age</label>
          <input
            type="number"
            id={"age"}
            className={`${errors.age ? "error-input" : ""}`}
            defaultValue={data.age}
            {...register("age")}
            min={18}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}

          <div>
            <label htmlFor={"gender"}>Male</label>
            <input
              type="radio"
              id={"gender"}
              className={`${errors.gender ? "error-input" : ""}`}
              value="true"
              {...register("gender")}
            />
            <label htmlFor={"gender-female"}>Female</label>
            <input
              type="radio"
              id={"gender-female"}
              className={`${errors.gender ? "error-input" : ""}`}
              value="false"
              {...register("gender")}
            />
            {errors.gender && (
              <p className="error-message">{errors.gender.message}</p>
            )}
          </div>

          <label htmlFor={"activityLevel"}>Activity Level</label>
          <input
            type="number"
            id={"activityLevel"}
            className={`${errors.activityLevel ? "error-input" : ""}`}
            defaultValue={data.activityLevel}
            {...register("activityLevel")}
            min={1}
          />
          {errors.activityLevel && (
            <p className="error-message">{errors.activityLevel.message}</p>
          )}

          <label htmlFor={"targetDeficitPercent"}>Deficit Percent</label>
          <input
            type="number"
            id={"targetDeficitPercent"}
            className={`${errors.targetDeficitPercent ? "error-input" : ""}`}
            defaultValue={data.targetDeficitPercent}
            {...register("targetDeficitPercent")}
            min={0}
          />
          {errors.targetDeficitPercent && (
            <p className="error-message">
              {errors.targetDeficitPercent.message}
            </p>
          )}
          <button type="submit">Update info</button>
        </form>
      </div>
    </Layout>
  );
};

export default Calculator;
