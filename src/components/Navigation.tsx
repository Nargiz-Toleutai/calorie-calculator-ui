import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navigation = () => {
  const [getToken, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  return (
    <ul className="navigation-container">
      <h1>FitFuel</h1>
      {router.pathname !== "/" && (
        <li className="navigation-item">
          <Link href="/">Home</Link>
        </li>
      )}
      {router.pathname !== "/about" && (
        <li className="navigation-item">
          <Link href="/about">About Us</Link>
        </li>
      )}
      {router.pathname !== "/contact" && (
        <li className="navigation-item">
          <Link href="/contact">Contact</Link>
        </li>
      )}
      {getToken && router.pathname !== "/dashboard" && (
        <li className="navigation-item">
          <Link href="/dashboard">Dashboard</Link>
        </li>
      )}
      {getToken === null ? (
        <>
          {router.pathname !== "/login" && (
            <li className="navigation-item">
              <Link href="/login">Sign in</Link>
            </li>
          )}
          {router.pathname !== "/register" && (
            <li className="navigation-item">
              <Link href="/register">Sign up</Link>
            </li>
          )}
        </>
      ) : (
        <li className="navigation-item">
          <button
            onClick={() => {
              setToken(null);
              localStorage.removeItem("token");
            }}
          >
            <Link href="/"> Log out</Link>
          </button>
        </li>
      )}
    </ul>
  );
};

export default Navigation;
