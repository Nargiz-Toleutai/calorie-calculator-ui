import React from "react";

const Path = (props: any) => (
  <path
    fill="transparent"
    strokeWidth="3"
    stroke="var(--neutral-800)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: { toggle: () => void }) => {
  return (
    <button
      onClick={toggle}
      className="menu-btn outline-none border-none cursor-pointer absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-neutral-800 p-2"
    >
      <svg width={23} height={18} viewBox="0 0 23 18">
        <Path d="M 2 2.5 L 20 2.5" className="top" />
        <Path d="M 2 9.423 L 20 9.423" opacity="1" className="middle" />
        <Path d="M 2 16.346 L 20 16.346" className="bottom" />
      </svg>
    </button>
  );
};
