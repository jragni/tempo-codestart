/**
 * SidebarMenu component
 */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "react-daisyui";
import { FaCode } from "react-icons/fa";

import { Problem } from "../Workspace/definitions";
import { topicsList } from "./constants";

interface SidebarMenuProps {
  problems: Problem[];
}

export default function SidebarMenu({ problems }: SidebarMenuProps) {
  const pathname = usePathname();

  return (
    <Menu className="space-y-2">
      {topicsList.map((topic) => {
        const topicProblems = problems
          .sort((a, b) => Number(a.id) - Number(b.id))
          .filter((problem) => problem.topic === topic.toLowerCase());

        const problemCount = topicProblems.length;

        return (
          <Menu.Details
            key={`${topic}-sidebar-menu-problems`}
            label={
              <span className="text-lg font-bold flex items-center justify-between w-full">
                {topic}
                <span className="badge badge-primary badge-sm">{problemCount}</span>
              </span>
            }
          >
            {topicProblems.map((problem, index) => {
              const isActive = pathname === `/problems/${problem.slug}`;
              return (
                <Menu.Item key={`${problem.slug}-menu-item`}>
                  <Link
                    className={`text-base font-normal flex items-center gap-2 hover:bg-base-200 rounded-lg px-2 py-1 ${
                      isActive ? 'bg-primary text-primary-content' : ''
                    }`}
                    href={`/problems/${problem.slug}`}
                    key={problem.slug}
                  >
                    <FaCode className="flex-shrink-0" size={14} />
                    <span className="flex-1 truncate">{problem.title}</span>
                    <span className="badge badge-ghost badge-xs">{index + 1}</span>
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu.Details>
        );
      })}
    </Menu>
  );
}
