import React from "react";
import Layout from "../components/Layout";

interface CircleProgressProps {
  proteins: number;
  fats: number;
  carbs: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  proteins,
  fats,
  carbs,
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const getOffset = (percentage: number) =>
    circumference - (percentage / 100) * circumference;

  return (
    <svg className="w-40 h-40">
      {/* Background Circle */}
      <circle
        className="text-gray-200"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50%"
        cy="50%"
      />
      {/* Proteins Circle */}
      <circle
        className="text-orange-500"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={getOffset(proteins)}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50%"
        cy="50%"
      />
      {/* Fats Circle */}
      <circle
        className="text-orange-300"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={getOffset(fats)}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50%"
        cy="50%"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      {/* Carbs Circle */}
      <circle
        className="text-orange-100"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={getOffset(carbs)}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50%"
        cy="50%"
        style={{ transform: "rotate(-180deg)", transformOrigin: "center" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xl font-bold text-orange-500"
      >
        Kcal
      </text>
      <text
        x="50%"
        y="60%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-2xl font-bold text-orange-500"
      >
        1457
      </text>
    </svg>
  );
};

export default CircleProgress;
