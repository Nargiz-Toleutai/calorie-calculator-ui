import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

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
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={"/fitFuelLogo.png"}
            alt={"FitFuel Logo"}
            width="auto"
            height="auto"
            className="h-12 mr-4"
          />
        </Link>
        <div className="md:hidden"></div>
        <ul className="flex gap-4 md:flex md:flex-row md:gap-4">
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
