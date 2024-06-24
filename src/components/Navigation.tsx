import Link from "next/link";
import { useEffect, useState } from "react";

const Navigation = () => {
  const [getToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  return (
    <ul className="navigation-container">
      <h1>FitFuel</h1>
      <li className="navigation-item">
        <Link href="/">Home</Link>
      </li>
      <li className="navigation-item">
        <Link href="/about">About Us</Link>
      </li>
      <li className="navigation-item">
        <Link href="/contact">Contact</Link>
      </li>
      {getToken && (
        <li className="navigation-item">
          <Link href="/dashboard">Dashboard</Link>
        </li>
      )}
      {getToken === null ? (
        <>
          <li className="navigation-item">
            <Link href="/login">Sign in</Link>
          </li>
          <li className="navigation-item">
            <Link href="/register">Sign up</Link>
          </li>
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
