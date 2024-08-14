import React from "react";
import { FeatureItemProps } from "./types";

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex-1 text-center p-4 min-h-[200px]">
      {icon}
      <h3 className="text-xl uppercase font-semibold mt-4">{title}</h3>
      <p className="mt-2">{description}</p>
    </div>
  );
};

export default FeatureItem;
