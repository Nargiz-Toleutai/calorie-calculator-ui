import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NavigationLinkProps } from "./types";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({ id, title, to }: NavigationLinkProps) => {
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-between p-2 m-2 rounded"
    >
      <div className="border-solid border-2 border-green-800" />
      <Link
        href={to}
        className="text-black no-underline text-xl font-bold py-1 px-8 rounded transition-all duration-300 ease-in-out hover:bg-white hover:rounded-full"
        id={id}
      >
        {title}
      </Link>
      <div className="border-solid border-2 border-green-800" />
    </motion.li>
  );
};
