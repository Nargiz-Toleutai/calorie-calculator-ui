import React from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import FlipText from "./magicui/flip-text";
import { Github, Mail, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bottom-0 mt-auto">
      <div className="flex h-20 w-full flex-col items-center justify-center  overflow-hidden rounded-lg bg-background ">
        <Dock>
          <FlipText
            className="text-2xl font-bold tracking-[-0.2em] text-black md:text-base md:leading-[4rem]"
            word="Contact us"
          />
          <DockIcon>
            <a
              href="https://github.com/Nargiz-Toleutai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github color="#22c55d" className="h-6 w-6" />
            </a>
          </DockIcon>
          <DockIcon>
            <a href="mailto:nargiza.toleutai@gmail.com">
              <Mail color="#22c55d" className="h-6 w-6" />
            </a>
          </DockIcon>
          <DockIcon>
            <a
              href="https://t.me/nargiza_toleutai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send color="#22c55d" className="h-6 w-6" />
            </a>
          </DockIcon>
        </Dock>
      </div>
    </footer>
  );
};

export default Footer;
