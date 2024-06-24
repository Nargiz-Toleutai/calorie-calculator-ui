import { ReactNode } from "react";

import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navigation />
      <main className="content">{children}</main>
    </>
  );
};

export default Layout;
