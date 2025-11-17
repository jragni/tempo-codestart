"use client";
import { useState } from "react";
import { Drawer } from "@material-tailwind/react";
import { ImMenu } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

import { usePathname } from "next/navigation";

import { Problem } from "../Workspace/definitions";
import SidebarMenu from "./SidebarMenu";
import { User, UserProblem } from "@/app/definitions";
interface ClientSidebarProps {
  problems: Problem[];
  user?: User | null;
  userProblems?: UserProblem[];
}

export default function ClientSidebar({ problems, user, userProblems = [] }: ClientSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (usePathname() === "/") return null;

  return (
    <section className="bg-neutral min-h-[calc(100dvh)] w-fit min-w-[47px]">
      <button
        className="flex align-center justify-center w-full mt-4 hover:bg-base-300 p-3 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle problem menu"
      >
        <ImMenu size={20} />
      </button>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <Drawer
        className="p-4 w-80 bg-neutral text-base-content overflow-auto max-h-[calc(100dvh-64px)] shadow-2xl z-[9999]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Problems</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close menu"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <SidebarMenu problems={problems} userProblems={userProblems} />
      </Drawer>
    </section>
  );
}
