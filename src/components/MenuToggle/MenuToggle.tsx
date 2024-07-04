import {
  AlignJustify,
  Apple,
  House,
  LayoutDashboard,
  LogIn,
  LogOut,
  NotebookPen,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const MenuToggle = () => {
  const [getToken, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <AlignJustify color="#22c55d" />
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      <aside
        ref={menuRef}
        id="default-sidebar"
        className={`fixed -top-5 -right-10 z-40 w-64 h-screen transition-transform  ${
          isMenuOpen ? "translate-x-0" : "translate-x-200"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/" className="flex items-center p-2">
                <House color="#22c55d" />
                <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                  Home
                </span>
              </Link>
            </li>
            {getToken && (
              <li>
                <Link href="/meals" className="flex items-center p-2">
                  <LayoutDashboard color="#22c55d" />
                  <span className="ms-3 text-gray-600 hover:text-green-500">
                    Meals
                  </span>
                </Link>
              </li>
            )}
            {getToken && (
              <li>
                <Link href="/products" className="flex items-center p-2">
                  <Apple color="#22c55d" />
                  <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                    Products
                  </span>
                </Link>
              </li>
            )}
            {getToken && (
              <li>
                <Link href="/account" className="flex items-center p-2">
                  <User color="#22c55d" />
                  <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                    Account
                  </span>
                </Link>
              </li>
            )}
            {getToken === null ? (
              <>
                <li>
                  <Link href="/login" className="flex items-center p-2">
                    <LogIn color="#22c55d" />
                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                      Sign In
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="flex items-center p-2">
                    <NotebookPen color="#22c55d" />
                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                      Sign Up
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setToken(null);
                    localStorage.removeItem("token");
                  }}
                >
                  <Link href="/login" className="flex items-center p-2">
                    <LogOut color="#22c55d" />
                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-green-500">
                      Log out
                    </span>
                  </Link>
                </button>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default MenuToggle;

// <button
//   onClick={toggle}
//   classNameName="menu-btn outline-none border-none  cursor-pointer absolute top-2 right-4 w-12 h-12 text-neutral-800 align-middle p-2"
// >
//   <AlignJustify color="#22c55d" />
// </button>
