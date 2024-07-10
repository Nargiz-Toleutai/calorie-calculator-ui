import { ReactNode } from "react";

import Navigation from "./Navigation";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
  imgUrl?: string;
}

const Layout = ({ children, imgUrl }: LayoutProps) => {
  return (
    <div
      className="min-h-screen bg-fixed bg-cover"
      style={{
        backgroundImage: imgUrl ? `url("${imgUrl}")` : undefined,
      }}
    >
      <Navigation />
      <main className=" xl:mx-auto">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
// <main className="xl:container xl:mx-auto">{children}</main>
