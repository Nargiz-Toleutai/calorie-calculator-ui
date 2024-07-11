import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import DataSelector from "./DataSelector";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import GaugeCircle from "./magicui/gauge-circle";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPr,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { calulateCalories, calulatePFCForGoal } from "@/calculation/calories";
import RadioButtonsGroup from "./RadioButtonsGroup";

const AdditionalUserDataValidator = z
  .object({
    weight: z.preprocess(
      Number,
      z.number().min(40, { message: "Weight should be a minimum of 40kg" })
    ),
    height: z.preprocess(
      Number,
      z.number().min(50, { message: "Height should be a minimum of 50cm" })
    ),
    age: z.preprocess(
      Number,
      z.number().min(18, { message: "Age should be a minimum of 18" })
    ),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    activityLevel: z.preprocess(
      Number,
      z.number().min(1, { message: "Activity level should be a minimum of 1" })
    ),
    targetDeficitPercent: z.preprocess(
      Number,
      z
        .number()
        .min(0, { message: "Deficit percentage should be a minimum of 0" })
    ),
    calorieTarget: z.preprocess(Number, z.number()),
  })
  .strict();

export type User = z.infer<typeof AdditionalUserDataValidator>;

interface PFC {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const notify = () => {
  toast.success("Your personal info was updated");
};

const PersonalData: React.FC = () => {
  const [data, setData] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [calorieTarget, setCalorieTarget] = useState<number | null>(null);
  const [pfc, setPFC] = useState<PFC>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
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
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user_info`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (authError) {
      router.push("/login");
    }
  }, [authError, router]);

  const handleUpdateData = async (formData: User) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to update user data");
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
      const pfc = calulatePFCForGoal(
        gender,
        weight,
        height,
        age,
        activityLevel,
        targetDeficitPercent
      );
      setPFC(pfc);
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  if (authError) {
    return <div>{authError}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const ageOptions = Array.from({ length: 121 }, (_, i) => i + 18);
  const heightOptions = Array.from({ length: 151 }, (_, i) => i + 100);
  const weightOptions = Array.from({ length: 161 }, (_, i) => i + 40);

  const genderOptions = [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
  ];

  const activityLevels = [
    {
      value: 1,
      label: "Sedentary",
      description: "Mostly sitting or lying down, minimal physical activity.",
    },
    {
      value: 2,
      label: "Lightly Active",
      description:
        "Light physical activity, such as daily walks or light housework.",
    },
    {
      value: 3,
      label: "Moderately Active",
      description:
        "Regular physical activity, including exercise and more frequent movement.",
    },
    {
      value: 4,
      label: "Very Active",
      description:
        "High level of physical activity, including intense exercise and active work.",
    },
    {
      value: 5,
      label: "Super Active",
      description:
        "Extremely high physical activity, usually involving intense exercise routines and physically demanding work.",
    },
  ];

  const deficitPercents = [
    {
      value: 10,
      label: "10%",
      description:
        "Mild weight loss - Soft reduction, suitable for beginners or those wanting a gentle approach.",
    },
    {
      value: 15,
      label: "15%",
      description:
        "Moderate weight loss - Balanced reduction, good for gradual and sustainable weight loss.",
    },
    {
      value: 20,
      label: "20%",
      description:
        "Noticeable weight loss - More significant reduction, suitable for those with a clear weight loss goal.",
    },
    {
      value: 25,
      label: "25%",
      description:
        "Accelerated weight loss - Faster reduction, suitable for those looking for quicker results.",
    },
    {
      value: 30,
      label: "30%",
      description:
        "Aggressive weight loss - Significant reduction, suitable for those committed to rapid weight loss.",
    },
    {
      value: 35,
      label: "35%",
      description:
        "Intense weight loss - High reduction, suitable for those with experience in weight management.",
    },
    {
      value: 40,
      label: "40%",
      description:
        "Very intense weight loss - Very high reduction, suitable for those with significant weight loss experience.",
    },
    {
      value: 45,
      label: "45%",
      description:
        "Extreme weight loss - Maximum reduction, suitable for those under professional guidance.",
    },
  ];

  const proteinPercent = ((pfc.protein * 4) / pfc.calories) * 100;
  const carbsPercent = ((pfc.carbs * 4) / pfc.calories) * 100;
  const fatPercent = ((pfc.fat * 9) / pfc.calories) * 100;

  console.log({ proteinPercent, carbsPercent, fatPercent });

  return (
    <div className="min-h-screen flex items-center justify-center bg-center bg-contain bg-no-repeat">
      <div className="max-w-4xl w-full mt-32 mb-32 p-8 bg-white bg-opacity-80 backdrop-blur rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Calculate your daily calorie intake
        </h1>
        <form onSubmit={handleSubmit(handleUpdateData)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 m-0.5">
                Age
              </label>
              <Controller
                name="age"
                control={control}
                defaultValue={data.age ?? 18}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="age"
                    inputProps={{ min: 18, max: 80 }}
                    fullWidth
                    variant="outlined"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 m-0.5">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                defaultValue={data.gender ?? "female"}
                render={({ field }) => (
                  <RadioButtonsGroup
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    options={genderOptions}
                  />
                )}
              />
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 m-0.5">
                Height (cm)
              </label>
              <Controller
                name="height"
                control={control}
                defaultValue={data.height ?? 100}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    inputProps={{ min: 100, max: 250 }}
                    fullWidth
                    variant="outlined"
                    error={!!errors.height}
                    helperText={errors.height?.message}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">
                Weight (kg)
              </label>
              <Controller
                name="weight"
                control={control}
                defaultValue={data.weight ?? 40}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    inputProps={{ min: 40, max: 200 }}
                    fullWidth
                    variant="outlined"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                )}
              />
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
                defaultValue={data.activityLevel ?? 1}
                render={({ field }) => (
                  <SelectPr
                    {...field}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-[280px] bg-white h-14 hover:border-red-600">
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map(({ value, label, description }) => (
                        <SelectGroup key={value}>
                          <SelectItem value={value.toString()}>
                            {label}
                            <div className="text-xs text-gray-500 ml-2">
                              {description}
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </SelectPr>
                )}
              />
              {errors.activityLevel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityLevel?.message}
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
                defaultValue={data.targetDeficitPercent ?? 10}
                render={({ field }) => (
                  <SelectPr
                    {...field}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-[280px] bg-white h-14">
                      <SelectValue placeholder="Select your deficit percent" />
                    </SelectTrigger>
                    <SelectContent>
                      {deficitPercents.map(({ value, label, description }) => (
                        <SelectGroup key={value}>
                          <SelectItem value={value.toString()}>
                            {label}
                            <div className="text-xs text-gray-500 ml-2">
                              {description}
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </SelectPr>
                )}
              />
              {errors.targetDeficitPercent && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetDeficitPercent?.message}
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

        {calorieTarget !== null && calorieTarget > 0 && (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Calorie Target</h2>
              <p className="text-lg">
                Your daily calorie target is:{" "}
                <span className="font-bold">{calorieTarget} kcal</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-6">
              <div>
                <span className="items-center flex justify-center text-xl mb-4">
                  Carbs
                </span>
                <GaugeCircle
                  name="Carbs"
                  max={100}
                  value={carbsPercent}
                  min={0}
                  gaugePrimaryColor="red"
                  gaugeSecondaryColor="white"
                />
              </div>

              <div>
                <span className="items-center flex justify-center text-xl mb-4">
                  Protein
                </span>
                <GaugeCircle
                  name="Protein"
                  max={100}
                  value={proteinPercent}
                  min={0}
                  gaugePrimaryColor="green"
                  gaugeSecondaryColor="white"
                />
              </div>

              <div>
                <span className="items-center flex justify-center text-xl mb-4">
                  Fat
                </span>
                <GaugeCircle
                  name="Fat"
                  max={100}
                  value={fatPercent}
                  min={0}
                  gaugePrimaryColor="yellow"
                  gaugeSecondaryColor="white"
                />
              </div>
            </div>

            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Link href="/meals">View Recipes</Link>
            </button>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default PersonalData;
