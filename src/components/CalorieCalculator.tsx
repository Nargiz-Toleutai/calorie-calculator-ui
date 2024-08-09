import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calulateCalories } from "@/calculation/calories";

const AdditionalUserDataValidator = z
  .object({
    name: z.string().min(1, {
      message: "Name should have a minimum length of 1 character",
    }),

    weight: z.number().min(40, {
      message: "Weight should be a minimum of 40kg",
    }),
    height: z.number().min(30, {
      message: "Height should be a minimum of 30cm",
    }),
    age: z.number().min(18, {
      message: "Age should be a minimum of 18",
    }),
    gender: z.enum(["male", "female"], {
      message: "Gender is required",
    }),
    activityLevel: z.number().min(1, {
      message: "Activity level should be a minimum of 1",
    }),
    targetDeficitPercent: z.number().min(0, {
      message: "Deficit percentage should be a minimum of 0",
    }),
  })
  .strict();

type User = z.infer<typeof AdditionalUserDataValidator>;

const CalorieCalculator = () => {
  const [data, setData] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(AdditionalUserDataValidator),
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      return;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      try {
        const responseUserData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user_info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!responseUserData.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await responseUserData.json();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };
    fetchData();
  }, [token]);

  if (!data) {
    // We don't have all the data for the user, probably a bug
    return <p>Something went wrong</p>;
  }

  const { weight, age, height, activityLevel, gender, targetDeficitPercent } =
    data;
  const caloriesFromPFC = calulateCalories(
    gender,
    weight,
    height,
    age,
    activityLevel,
    targetDeficitPercent
  );

  return (
    <div className="min-h-screen flex pt-16 bg-opacity-80">
      <h2 className="bg-green-200">Total</h2>
      {/* <p className="w-32 text-pretty">{JSON.stringify(data, null, "\t")}</p> */}
      <p>{Math.round(caloriesFromPFC)}</p>
    </div>
  );
};

export default CalorieCalculator;
