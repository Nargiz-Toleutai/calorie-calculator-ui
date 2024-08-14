import React, { useEffect, useState } from "react";
import { BookOpenText, ChefHat, Soup } from "lucide-react";
import AppQRCode from "@/components/AppQRCode";
import FlipText from "./../magicui/flip-text";
import Footer from "./Footer";
import { PrimaryActionButton } from "@/button/PrimaryActionButton";
import FeatureItem from "./FeatureItem";

const HomePageInfoPanel = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const appUrl = "https://fitfuel-calorie-calculator.vercel.app/";

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
              {token ? (
                <PrimaryActionButton
                  title={"Let's Start Now"}
                  href={"/account"}
                />
              ) : (
                <PrimaryActionButton
                  title={"Let's Start Now"}
                  href={"/login"}
                />
              )}
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
              <FeatureItem
                icon={<Soup color="#68bd82" size={64} className="mx-auto" />}
                title="Select & add Ingredients"
                description="Type and search for the ingredients of your choice"
              />
              <FeatureItem
                icon={<ChefHat color="#68bd82" size={64} className="mx-auto" />}
                title="Create recipe"
                description="Prepare your own meal with the selected ingredients"
              />
              <FeatureItem
                icon={
                  <BookOpenText color="#68bd82" size={64} className="mx-auto" />
                }
                title="Get nutrition information"
                description="Get your personalized information ready with properly balanced nutrition"
              />
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
