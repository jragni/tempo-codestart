/**
 * SidebarMenu component
 */
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "react-daisyui";
import { FaCode, FaBook, FaListOl, FaTable, FaCube, FaSearch } from "react-icons/fa";

import { Problem } from "../Workspace/definitions";
import { UserProblem } from "@/app/definitions";
import { topicsList } from "./constants";

interface SidebarMenuProps {
  problems: Problem[];
  userProblems?: UserProblem[];
}

// Topic icons mapping
const topicIcons: Record<string, JSX.Element> = {
  'Basics': <FaBook className="w-4 h-4" />,
  'Conditionals': <FaListOl className="w-4 h-4" />,
  'Arrays': <FaTable className="w-4 h-4" />,
  'Objects': <FaCube className="w-4 h-4" />,
  'Nested Data': <FaCube className="w-4 h-4" />,
};

// Get difficulty color
const getDifficultyColor = (diff?: string) => {
  switch (diff) {
    case 'Easy': return 'text-success';
    case 'Medium': return 'text-warning';
    case 'Hard': return 'text-error';
    default: return 'text-base-content';
  }
};

export default function SidebarMenu({ problems, userProblems = [] }: SidebarMenuProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Create a map for quick lookup of solved problems
  const solvedProblemsMap = userProblems.reduce((acc, up) => {
    if (up.isSolved) {
      acc[up.problemId] = true;
    }
    return acc;
  }, {} as Record<string, boolean>);

  // Calculate overall progress
  const overallStats = useMemo(() => {
    const totalProblems = problems.length;
    const totalSolved = Object.keys(solvedProblemsMap).length;
    const percentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
    return { totalProblems, totalSolved, percentage };
  }, [problems, solvedProblemsMap]);

  // Filter problems by search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return topicsList;

    return topicsList.filter(topic => {
      const topicProblems = problems.filter(p => p.topic === topic.toLowerCase());
      return topicProblems.some(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, problems]);

  return (
    <div className="space-y-4">
      {/* Progress Summary Card */}
      {userProblems.length > 0 && (
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Your Progress</span>
              <span className="text-xs badge badge-primary">{overallStats.percentage}%</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallStats.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-base-content/70">
              <span>{overallStats.totalSolved} solved</span>
              <span>{overallStats.totalProblems} total</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="form-control">
        <div className="input-group input-group-sm">
          <span className="bg-base-200">
            <FaSearch className="w-3 h-3" />
          </span>
          <input
            type="text"
            placeholder="Search problems..."
            className="input input-sm input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Topics Menu */}
      <Menu className="space-y-2">
        {filteredTopics.map((topic) => {
          const topicProblems = problems
            .sort((a, b) => Number(a.id) - Number(b.id))
            .filter((problem) => {
              const matchesTopic = problem.topic === topic.toLowerCase();
              const matchesSearch = !searchQuery ||
                problem.title.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesTopic && matchesSearch;
            });

          const problemCount = topicProblems.length;
          const solvedCount = topicProblems.filter(p => solvedProblemsMap[p.id]).length;
          const progressPercentage = problemCount > 0 ? (solvedCount / problemCount) * 100 : 0;

          if (problemCount === 0) return null;

          return (
            <Menu.Details
              key={`${topic}-sidebar-menu-problems`}
              label={
                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      {topicIcons[topic] || <FaCode className="w-4 h-4" />}
                      <span className="text-base font-bold">{topic}</span>
                    </div>
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
                  </div>
                  {/* Progress bar */}
                  {problemCount > 0 && (
                    <div className="w-full bg-base-300 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          solvedCount === problemCount ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              }
            >
              {topicProblems.map((problem, index) => {
                const isActive = pathname === `/problems/${problem.slug}`;
                const isSolved = solvedProblemsMap[problem.id];
                const diffColor = getDifficultyColor(problem.difficulty);

                return (
                  <Menu.Item key={`${problem.slug}-menu-item`}>
                    <Link
                      className={`text-sm font-normal flex items-center gap-2 hover:bg-base-200 rounded-lg px-2 py-2 transition-all ${
                        isActive ? 'bg-primary text-primary-content shadow-md' : ''
                      }`}
                      href={`/problems/${problem.slug}`}
                      key={problem.slug}
                      title={problem.title}
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
                        <FaCode className="flex-shrink-0 opacity-50" size={14} />
                      )}
                      <span className="flex-1 truncate">{problem.title}</span>
                      <div className="flex items-center gap-1">
                        {problem.difficulty && (
                          <span className={`text-xs font-semibold ${diffColor}`}>
                            {problem.difficulty[0]}
                          </span>
                        )}
                        <span className="badge badge-ghost badge-xs">{index + 1}</span>
                      </div>
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu.Details>
          );
        })}
      </Menu>

      {/* No results message */}
      {searchQuery && filteredTopics.length === 0 && (
        <div className="text-center py-8 text-base-content/50">
          <FaSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No problems found</p>
          <p className="text-xs">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
