/**
 * SidebarMenu component
 */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "react-daisyui";
import { FaCode } from "react-icons/fa";

import { Problem } from "../Workspace/definitions";
import { UserProblem } from "@/app/definitions";
import { topicsList } from "./constants";

interface SidebarMenuProps {
  problems: Problem[];
  userProblems?: UserProblem[];
}

export default function SidebarMenu({ problems, userProblems = [] }: SidebarMenuProps) {
  const pathname = usePathname();

  // Create a map for quick lookup of solved problems
  const solvedProblemsMap = userProblems.reduce((acc, up) => {
    if (up.isSolved) {
      acc[up.problemId] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <Menu className="space-y-2">
      {topicsList.map((topic) => {
        const topicProblems = problems
          .sort((a, b) => Number(a.id) - Number(b.id))
          .filter((problem) => problem.topic === topic.toLowerCase());

        const problemCount = topicProblems.length;
        const solvedCount = topicProblems.filter(p => solvedProblemsMap[p.id]).length;

        return (
          <Menu.Details
            key={`${topic}-sidebar-menu-problems`}
            label={
              <span className="text-lg font-bold flex items-center justify-between w-full">
                {topic}
                <div className="flex gap-2">
                  {solvedCount > 0 && (
                    <span className="badge badge-success badge-sm">
                      {solvedCount}/{problemCount}
                    </span>
                  )}
                  {solvedCount === 0 && (
                    <span className="badge badge-primary badge-sm">{problemCount}</span>
                  )}
                </div>
              </span>
            }
          >
            {topicProblems.map((problem, index) => {
              const isActive = pathname === `/problems/${problem.slug}`;
              const isSolved = solvedProblemsMap[problem.id];
              return (
                <Menu.Item key={`${problem.slug}-menu-item`}>
                  <Link
                    className={`text-base font-normal flex items-center gap-2 hover:bg-base-200 rounded-lg px-2 py-1 ${
                      isActive ? 'bg-primary text-primary-content' : ''
                    }`}
                    href={`/problems/${problem.slug}`}
                    key={problem.slug}
                  >
                    {isSolved ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-4 h-4 stroke-success flex-shrink-0"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    ) : (
                      <FaCode className="flex-shrink-0" size={14} />
                    )}
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
