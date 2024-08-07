import { ReactNode, useEffect, useState } from "react";

import Navigation from "./Navigation";
import { Toaster } from "react-hot-toast";
import BurgerMenu from "./BurgerMenu/BurgerMenu";

interface LayoutProps {
  children: ReactNode;
  imgUrl?: string;
}

const Layout = ({ children, imgUrl }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 873);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover"
      style={{
        backgroundImage: imgUrl ? `url("${imgUrl}")` : undefined,
      }}
    >
      {isMobile ? <BurgerMenu /> : <Navigation />}
      <main className=" xl:mx-auto">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
