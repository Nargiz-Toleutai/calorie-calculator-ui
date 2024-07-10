import React, { useEffect, useState } from "react";
import { BookOpenText, ChefHat, Layout, Soup } from "lucide-react";
import Link from "next/link";
import AppQRCode from "@/components/AppQRCode";
import FlipText from "./magicui/flip-text";
import Footer from "./Footer";

const HomePageInfoPanel = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const appUrl = "https://fitfuel-calorie-calculator.vercel.app/"; // Replace with your actual URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col">
        <div>
          <div
            className="relative bg-cover bg-center h-full w-full"
            style={{
              backgroundImage:
                'url("/background-images/home-page-background-img.jpg")',
            }}
          >
            <div className="text-center pt-16 bg-opacity-80 rounded-md h-160 md:h-380 flex justify-center items-center flex-col w-full max-w-7xl mx-auto px-4">
              <FlipText
                className="hidden md:block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.1em] text-black leading-tight z-0"
                word="When in doubt, use nutrition first."
              />
              <h1 className="block md:hidden text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.1em] text-black leading-tight z-0">
                When in doubt, use nutrition first.
              </h1>
              <p className="text-base sm:text-lg mt-2">
                Learn to eat healthier with a quick and simple way to count your
                calories along.
              </p>
              <button className="mt-4 px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors">
                {token ? (
                  <Link href="/account">Let&apos;s Start Now</Link>
                ) : (
                  <Link href="/login">Let&apos;s Start Now</Link>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="xl:container xl:mx-auto flex-grow-1 justify-start flex-col">
          <div className="pt-8 px-8">
            <h2 className="text-3xl font-bold text-center">
              Recipe Nutrient Calculator
            </h2>
            <p className="text-center text-lg mt-2 mb-8">
              Track your nutrients accurately, count calories on any diet, and
              find your personalized nutritious recipes ready to use in one go.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 mt-8">
              <div className="flex-1 text-center p-4 min-h-[200px]">
                <Soup color="#68bd82" size={64} className="mx-auto" />
                <h3 className="text-xl uppercase font-semibold mt-4">
                  Select & add Ingredients
                </h3>
                <p className="mt-2">
                  Type and search for the ingredients of your choice
                </p>
              </div>
              <div className="flex-1 text-center p-4 min-h-[200px]">
                <ChefHat color="#68bd82" size={64} className="mx-auto" />
                <h3 className="text-xl uppercase font-semibold mt-4">
                  Create recipe
                </h3>
                <p className="mt-2">
                  Prepare your own meal with the selected ingredients
                </p>
              </div>
              <div className="flex-1 text-center p-4 min-h-[200px]">
                <BookOpenText color="#68bd82" size={64} className="mx-auto" />
                <h3 className="text-xl uppercase font-semibold mt-4">
                  Get nutrition information
                </h3>
                <p className="mt-2">
                  Get your personalized information ready with properly balanced
                  nutrition
                </p>
              </div>
            </div>
            <div className="flex-1 text-center p-4 mt-8 md:mt-0 flex-grow-1">
              <AppQRCode url={appUrl} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePageInfoPanel;
