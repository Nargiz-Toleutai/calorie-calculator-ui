import * as React from "react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { MenuItem } from "./MenuItem";

interface NavigationLinkProps {
  id?: string | undefined;
  to: string;
  title: string;

  tokenRequired: boolean | null;
}

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const BurgerMenuNavigation = ({ className }: any) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const router = useRouter();

  const links: NavigationLinkProps[] = useMemo(
    () => [
      {
        id: "1",
        to: "/",
        title: "Home",
        condition: router.pathname !== "/",
        tokenRequired: null,
      },
      {
        id: "2",
        to: "/meals",
        title: "Meals",
        tokenRequired: true,
      },
      {
        id: "3",
        to: "/products",
        title: "Products",
        tokenRequired: true,
      },
      {
        id: "4",
        to: "/account",
        title: "Account",
        tokenRequired: true,
      },
      {
        id: "5",
        to: "/login",
        title: "Sign in",
        tokenRequired: false,
      },
      {
        id: "6",
        to: "/register",
        title: "Sign up",
        tokenRequired: false,
      },
      {
        id: "7",
        to: "/login",
        title: "Log out",
        tokenRequired: true,
      },
    ],
    [router.pathname]
  );

  const filteredLinks = links.filter(
    (link) =>
      link.tokenRequired === null ||
      (token ? link.tokenRequired : !link.tokenRequired)
  );

  return (
    <motion.ul
      variants={variants}
      className={
        "flex flex-col items-center pt-20 p-4 fixed top-0 left-0 w-full h-full" +
        (className ? " " + className : "")
      }
    >
      {filteredLinks.map((link) => (
        <MenuItem key={link.id} {...link} />
      ))}
    </motion.ul>
  );
};
