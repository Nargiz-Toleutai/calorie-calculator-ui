import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";

import { MenuToggle } from "./MenuToggle";
import { BurgerMenuNavigation } from "./BurgerMenuNavigation";

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const BurgerMenu: React.FC = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      ref={containerRef}
      className={
        "fixed top-0 w-80 left-0 bottom-0 pt-24 will-change-transform z-[99]" +
        (isOpen ? "" : " pointer-events-none")
      }
    >
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full bg-white transition-colors duration-300 ease"
        variants={sidebarVariants}
      />
      <BurgerMenuNavigation />
      <MenuToggle
        toggle={() => toggleOpen()}
        className={isOpen ? "" : " pointer-events-auto"}
      />
    </motion.nav>
  );
};

export default BurgerMenu;
