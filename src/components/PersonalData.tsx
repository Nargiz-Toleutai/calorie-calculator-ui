import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserIdFromToken } from "@/utils";
import toast, { Toaster } from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { calulateCalories } from "@/calculation/calories";
import GaugeCircle from "./magicui/gauge-circle";

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
    gender: z.enum(["male", "female"], {
      message: "Gender is required",
    }),
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
    calorieTarget: z.preprocess((val) => Number(val), z.number()),
  })
  .strict();

export type User = z.infer<typeof AdditionalUserDataValidator>;

const notify = () => {
  toast.success("Your personal info was updated");
};

const PersonalData = () => {
  const [data, setData] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [calorieTarget, setCalorieTarget] = useState<number | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
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
  console.log({ errors });

  const handleUpdateData = async (formData: User) => {
    console.log({ formData });
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/user`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to update user data");
        return;
      }

      const result = await response.json();
      setData(result);
      notify();
      console.log("Information updated");

      const {
        weight,
        age,
        height,
        activityLevel,
        gender,
        targetDeficitPercent,
      } = result.updatedForm;
      const newCalorieTarget = Math.floor(
        calulateCalories(
          gender,
          weight,
          height,
          age,
          activityLevel,
          targetDeficitPercent
        )
      );
      setCalorieTarget(newCalorieTarget);
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white bg-opacity-80 backdrop-blur rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Calculate your daily calorie intake
        </h1>
        <form onSubmit={handleSubmit(handleUpdateData)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.age ? "border-red-500" : ""
                }`}
                min={18}
                max={80}
                defaultValue={data.age}
                {...register("age")}
              />

              {errors.age && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="mt-1 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio"
                    value="male"
                    {...register("gender")}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    value="female"
                    {...register("gender")}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height
              </label>
              <input
                type="number"
                className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.age ? "border-red-500" : ""
                }`}
                min={40}
                max={250}
                defaultValue={data.height}
                {...register("height")}
              />
              {errors.height && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.height.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <div className="relative w-full">
                <input
                  type="number"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.age ? "border-red-500" : ""
                  }`}
                  min={40}
                  max={200}
                  defaultValue={data.weight}
                  {...register("weight")}
                />
              </div>
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Activity Level
              </label>
              <Controller
                name="activityLevel"
                control={control}
                defaultValue={data.activityLevel}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-[280px] bg-white">
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">
                          Sedentary
                          <div className="text-xs text-gray-500 ml-2">
                            Mostly sitting or lying down, minimal physical
                            activity.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="2">
                          Lightly Active
                          <div className="text-xs text-gray-500 ml-2">
                            Light physical activity, such as daily walks or
                            light housework.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="3">
                          Moderately Active
                          <div className="text-xs text-gray-500 ml-2">
                            Regular physical activity, including exercise and
                            more frequent movement.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="4">
                          Very Active
                          <div className="text-xs text-gray-500 ml-2">
                            High level of physical activity, including intense
                            exercise and active work.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="5">
                          Super Active
                          <div className="text-xs text-gray-500 ml-2">
                            Extremely high physical activity, usually involving
                            intense exercise routines and physically demanding
                            work.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.activityLevel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityLevel.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deficit Percent
              </label>

              <Controller
                name="targetDeficitPercent"
                control={control}
                defaultValue={data.targetDeficitPercent}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-[280px] bg-white">
                      <SelectValue placeholder="Select your deficit percent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="10">
                          10%
                          <div className="text-xs text-gray-500 ml-2">
                            Mild weight loss - Soft reduction, suitable for
                            beginners or those wanting a gentle approach.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="15">
                          15%
                          <div className="text-xs text-gray-500 ml-2">
                            Moderate weight loss - Balanced reduction, good for
                            gradual and sustainable weight loss.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="20">
                          20%
                          <div className="text-xs text-gray-500 ml-2">
                            Noticeable weight loss - More significant reduction,
                            suitable for those with a clear weight loss goal.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="25">
                          25%
                          <div className="text-xs text-gray-500 ml-2">
                            Accelerated weight loss - Faster reduction, suitable
                            for those looking for quicker results.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="30">
                          30%
                          <div className="text-xs text-gray-500 ml-2">
                            Aggressive weight loss - Significant reduction,
                            suitable for those committed to rapid weight loss.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="35">
                          35%
                          <div className="text-xs text-gray-500 ml-2">
                            Intense weight loss - High reduction, suitable for
                            those with experience in weight management.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="40">
                          40%
                          <div className="text-xs text-gray-500 ml-2">
                            Very intense weight loss - Very high reduction,
                            suitable for those with significant weight loss
                            experience.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectItem value="45">
                          45%
                          <div className="text-xs text-gray-500 ml-2">
                            Extreme weight loss - Maximum reduction, suitable
                            for those under professional guidance.
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.targetDeficitPercent && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetDeficitPercent.message}
                </p>
              )}
            </div>
          </div>

          <input
            type="hidden"
            {...register("calorieTarget")}
            value={calorieTarget ?? data.calorieTarget}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Calculate
          </button>
        </form>

        {calorieTarget != null && calorieTarget > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Calorie Target</h2>
            <p className="text-lg">
              Your daily calorie target is:{" "}
              <span className="font-bold">{calorieTarget} kcal</span>
            </p>
          </div>
        )}
      </div>
      <GaugeCircle
        max={100}
        value={5}
        min={3}
        gaugePrimaryColor={"red"}
        gaugeSecondaryColor={"blue"}
      />
      <Toaster />
    </div>
  );
};

export default PersonalData;
