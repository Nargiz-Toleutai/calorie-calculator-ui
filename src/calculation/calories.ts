const getActivityLevelFactor = (activityLevel: number): number => {
  switch (activityLevel) {
    case 1:
      return 1.2;
    case 2:
      return 1.375;
    case 3:
      return 1.55;
    case 4:
      return 1.725;
    case 5:
      return 1.9;
    default:
      return 1.9;
  }
};

export const calulateCalories = (
  gender: "male" | "female",
  weight: number,
  height: number,
  age: number,
  activityLevel: number,
  targetDeficitPercent: number
): number => {
  const BMR =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const proteinPerKg = gender === "male" ? 1.6 : 1.4;

  const tdee = getActivityLevelFactor(activityLevel) * BMR;

  const calorieDeficit = tdee * (1 - targetDeficitPercent / 100);

  const proteinIntake = proteinPerKg * weight;

  const fatIntake = (calorieDeficit * 0.25) / 9;

  const carbsIntake = (calorieDeficit - proteinIntake * 4 - fatIntake * 9) / 4;
  console.log(carbsIntake);
  //   const carbsPerKg = carbsIntake / weight;
  //   const fatPerKg = fatIntake / weight;

  const caloriesFromPFC = proteinIntake * 4 + carbsIntake * 4 + fatIntake * 9;
  return Math.floor(caloriesFromPFC);
};

export const calulatePFCForGoal = (
  gender: "male" | "female",
  weight: number,
  height: number,
  age: number,
  activityLevel: number,
  targetDeficitPercent: number
) => {
  const BMR =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const proteinPerKg = gender === "male" ? 1.6 : 1.4;

  const tdee = getActivityLevelFactor(activityLevel) * BMR;

  const calorieDeficit = tdee * (1 - targetDeficitPercent / 100);

  const proteinIntake = proteinPerKg * weight;

  const fatIntake = (calorieDeficit * 0.25) / 9;

  const carbsIntake = (calorieDeficit - proteinIntake * 4 - fatIntake * 9) / 4;

  return {
    protein: Math.floor(proteinIntake),
    carbs: Math.floor(carbsIntake),
    fat: Math.floor(fatIntake),
  };
};
