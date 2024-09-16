"use client";
import { useState } from "react";
import { Drawer } from "@material-tailwind/react";
import { ImMenu } from "react-icons/im";

import { usePathname } from "next/navigation";

import { Problem } from "../Workspace/definitions";
import SidebarMenu from "./SidebarMenu";
import { User } from "@/app/definitions";
interface ClientSidebarProps {
  problems: Problem[];
  user?: User | null;
}

export default function ClientSidebar({ problems, user }: ClientSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (usePathname() === "/") return null;

  return (
    <section className="bg-neutral min-h-[calc(100dvh)] w-fit min-w-[47px]">
      <button
        className="flex align-center justify-center w-full mt-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ImMenu size={16} />
      </button>
      <Drawer
        className="p-4 w-80 bg-neutral text-base-content overflow-auto max-h-[calc(100dvh-64px)]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <SidebarMenu problems={problems} />
      </Drawer>
    </section>
  );
}
