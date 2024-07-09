import Link from "next/link";
import Image from "next/image";
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
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const menuItems = [
    { href: "/", label: "Home", condition: router.pathname !== "/" },
    {
      href: "/meals",
      label: "Meals",
      condition: token && router.pathname !== "/meals",
    },
    {
      href: "/products",
      label: "Products",
      condition: token && router.pathname !== "/products",
    },
    {
      href: "/account",
      label: "Account",
      condition: token && router.pathname !== "/account",
    },
    {
      href: "/login",
      label: "Sign in",
      condition: !token && router.pathname !== "/login",
    },
    {
      href: "/register",
      label: "Sign up",
      condition: !token && router.pathname !== "/register",
    },
  ];

  return (
    <div className="fixed top-5 w-full z-50 px-4">
      <nav className="text-white bg-white shadow-sm bg-opacity-80 backdrop-blur rounded-bl-lg rounded-tr-lg xl:container xl:mx-auto h-16 flex items-center justify-between px-4 md:px-auto">
        <Link href={"/"}>
          <Image
            src={"/fitFuelLogo.png"}
            alt={"FitFuel Logo"}
            width={100}
            height={140}
            className="h-12 mr-4"
          />
        </Link>
        <div className="md:hidden">
          <MenuToggle isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <ul
          className={`flex gap-4 ${
            isMenuOpen ? "flex flex-col items-center bg-white" : "hidden"
          } md:flex md:flex-row md:gap-4`}
        >
          {menuItems.map(
            ({ href, label, condition }) =>
              condition && (
                <li key={href} className="flex items-center">
                  <NavigationButton href={href}>{label}</NavigationButton>
                </li>
              )
          )}
          {token && (
            <li className="flex items-center">
              <button
                onClick={handleLogout}
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
