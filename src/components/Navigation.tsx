import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuToggle from "./MenuToggle/MenuToggle";

const NavigationButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="text-black hover:text-green-500 p-2 rounded">
    {children}
  </Link>
);

const Navigation = () => {
  const [getToken, setToken] = useState<string | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-5 w-full z-50 px-4">
      <nav className=" text-white bg-white shadow-sm bg-opacity-80 backdrop-blur rounded-bl-lg rounded-tr-lg xl:container xl:mx-auto h-16 flex items-center justify-between px-4 md:px-auto">
        <div className="flex items-center">
          <Link href={"/"}>
            <img
              src="/fitFuelLogo.png"
              alt="FitFuel Logo"
              className="h-12 mr-4"
            />
          </Link>
        </div>
        <div className="md:hidden">
          <MenuToggle />
        </div>
        <ul
          className={`flex gap-4 ${
            isMenuOpen ? "flex flex-col items-center bg-white" : "hidden"
          } md:flex md:flex-row md:gap-4`}
        >
          {router.pathname !== "/" && (
            <li className="flex items-center">
              <NavigationButton href="/">Home</NavigationButton>
            </li>
          )}
          {getToken && router.pathname !== "/meals" && (
            <li className="flex items-center">
              <NavigationButton href="/meals">Meals</NavigationButton>
            </li>
          )}
          {getToken && router.pathname !== "/products" && (
            <li className="flex items-center">
              <NavigationButton href="/products">Products</NavigationButton>
            </li>
          )}
          {getToken && router.pathname !== "/account" && (
            <li className="flex items-center">
              <NavigationButton href="/account">Account</NavigationButton>
            </li>
          )}
          {getToken === null ? (
            <>
              {router.pathname !== "/login" && (
                <li className="flex items-center">
                  <NavigationButton href="/login">Sign in</NavigationButton>
                </li>
              )}
              {router.pathname !== "/register" && (
                <li className="flex items-center">
                  <NavigationButton href="/register">Sign up</NavigationButton>
                </li>
              )}
            </>
          ) : (
            <li className="flex items-center">
              <button
                onClick={() => {
                  setToken(null);
                  localStorage.removeItem("token");
                }}
                className="text-grey-300 hover:text-green-300"
              >
                <NavigationButton href="/login">Log out</NavigationButton>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
