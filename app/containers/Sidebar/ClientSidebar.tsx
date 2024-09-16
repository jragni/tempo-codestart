"use client";
import { useState } from "react";
import { ImMenu } from "react-icons/im";
import { Drawer, Menu } from "react-daisyui";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { Problem } from "../Workspace/definitions";
import { User } from "@/app/definitions";

import { topicsList } from "./constants";

interface ClientSidebarProps {
  problems: Problem[];
  user?: User | null;
}

export default function ClientSidebar({ problems, user }: ClientSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (usePathname() === "/") return null;

  return (
    <section className="bg-neutral min-h-[calc(100dvh)] w-fit min-w-[47px]">
      <Drawer
        open={isOpen}
        onClickOverlay={() => setIsOpen(!isOpen)}
        side={
          <Menu className="mt-[64px] p-4 w-80 h-full bg-neutral text-base-content flex-nowrap">
            {topicsList.map((topic) => (
              <Menu.Details
                key={`${topic}-sidebar-menu-problems`}
                label={<span className="text-xl font-bold">{topic}</span>}
              >
                {problems
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .filter((problem) => problem.topic === topic.toLowerCase())
                  .map((problem) => (
                    <Menu.Item key={`${problem.slug}-menu-item`}>
                      <Link
                        className="text-lg font-thin"
                        href={`/problems/${problem.slug}`}
                        key={problem.slug}
                      >
                        {problem.title}
                      </Link>
                    </Menu.Item>
                  ))}
              </Menu.Details>
            ))}
          </Menu>
        }
      >
        <button
          className="flex align-center justify-center w-full mt-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ImMenu size={16} />
        </button>
      </Drawer>
    </section>
  );
}
