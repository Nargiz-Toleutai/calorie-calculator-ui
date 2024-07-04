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

const MenuToggle = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    toggleMenu();
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <House color="#22c55d" /> },
    {
      href: "/meals",
      label: "Meals",
      icon: <LayoutDashboard color="#22c55d" />,
      condition: token,
    },
    {
      href: "/products",
      label: "Products",
      icon: <Apple color="#22c55d" />,
      condition: token,
    },
    {
      href: "/account",
      label: "Account",
      icon: <User color="#22c55d" />,
      condition: token,
    },
    {
      href: "/login",
      label: "Sign In",
      icon: <LogIn color="#22c55d" />,
      condition: !token,
    },
    {
      href: "/register",
      label: "Sign Up",
      icon: <NotebookPen color="#22c55d" />,
      condition: !token,
    },
  ];

  return (
    <>
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-200 "
      >
        <span className="sr-only">Open sidebar</span>
        <AlignJustify color="#22c55d" />
      </button>

      {/* <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div> */}

      <aside
        ref={menuRef}
        className={`fixed -top-5 -right-10 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-200"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
          <ul className="space-y-2 font-medium">
            {menuItems.map(
              ({ href, label, icon, condition }) =>
                (condition === undefined || condition) && (
                  <li key={href}>
                    <Link href={href} className="flex items-center p-2">
                      {icon}
                      <span className="ms-3 text-gray-600 hover:text-green-500">
                        {label}
                      </span>
                    </Link>
                  </li>
                )
            )}
            {token && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2"
                >
                  <LogOut color="#22c55d" />
                  <span className="ms-3 text-gray-600 hover:text-green-500">
                    Log out
                  </span>
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
