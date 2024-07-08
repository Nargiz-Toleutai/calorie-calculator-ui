import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      height: {
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "192": "48rem",
        "256": "64rem",
      },
      translate: {
        "150": "150%",
        "200": "200%",
      },
    },
    theme: {
      extend: {
        keyframes: {
          "shine-pulse": {
            "0%": {
              "background-position": "0% 0%",
            },
            "50%": {
              "background-position": "100% 100%",
            },
            to: {
              "background-position": "0% 0%",
            },
          },
        },
      },
    },
    backgroundSize: {
      contain: "contain",
    },
    backgroundRepeat: {
      "no-repeat": "no-repeat",
    },
  },
  plugins: [],
};
export default config;
