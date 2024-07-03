import React, { useState, useEffect } from "react";

interface RangeProps {
  min?: number;
  max?: number;
  step?: number;
  width?: string;
}

const RangeSlider: React.FC<RangeProps> = ({
  min = 0,
  max = 100,
  step = 1,
  width = "100%",
}) => {
  const [value, setValue] = useState<number>(min);

  const setBubble = (value: number, min: number, max: number): string => {
    const newVal = ((value - min) * 100) / (max - min);
    return `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  };

  return (
    <div className="relative mx-auto mb-12" style={{ width }}>
      <input
        type="range"
        className="w-full focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <output
        className="bg-red-500 text-white py-1 px-3 rounded absolute transform -translate-x-1/2"
        style={{ left: setBubble(value, min, max) }}
      >
        {value}
      </output>
    </div>
  );
};

export default RangeSlider;
