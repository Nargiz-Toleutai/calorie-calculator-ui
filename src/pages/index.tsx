import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

// const UserValidator = z.object({
//   id: z.number().int(),
//   title: z.string(),
//   coverImgUrl: z.string(),
//   author: z.string(),
//   pageCount: z.number(),
// });

// export type User = z.infer<typeof UserValidator>;

// const userArrayValidator = z.array(UserValidator);

export default function Home() {
  return (
    <div className="home-page">
      <Layout>
        <div className="header">
          <h1>FitFuel</h1>
          <img
            src="./home-page-background-img.jpg"
            alt="home-page-img"
            width={1800}
            height={900}
          />
        </div>
        <div className="body">
          <p>Some info here</p>
        </div>
        <div className="footer">
          <button>Get started now</button>
        </div>
      </Layout>
    </div>
  );
}
