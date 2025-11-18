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
      {/* Progress Summary Card - Enhanced */}
      {userProblems.length > 0 && (
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-sm">
          <div className="card-body p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-base-content">Your Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-xs badge badge-primary font-mono">{overallStats.percentage}%</span>
                {overallStats.percentage === 100 && (
                  <span className="text-lg">🎉</span>
                )}
              </div>
            </div>
            <div className="w-full bg-base-300/50 rounded-full h-2.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-success to-primary h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${overallStats.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-success font-semibold">{overallStats.totalSolved} solved</span>
              <span className="text-base-content/60">{overallStats.totalProblems - overallStats.totalSolved} remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Enhanced with clear button */}
      <div className="form-control">
        <div className="input-group input-group-sm shadow-sm">
          <span className="bg-base-200 px-3">
            <FaSearch className="w-3.5 h-3.5 text-base-content/50" />
          </span>
          <input
            type="text"
            placeholder="Search problems..."
            className="input input-sm input-bordered w-full focus:outline-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-sm btn-ghost hover:btn-error"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <span className="text-xs text-base-content/60 mt-1 ml-1">
            Searching for &ldquo;{searchQuery}&rdquo;
          </span>
        )}
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
                <div className="w-full py-1">
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-base-200/80 flex items-center justify-center">
                        {topicIcons[topic] || <FaCode className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">{topic}</span>
                        <span className="text-xs text-base-content/60">
                          {problemCount} problem{problemCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {solvedCount > 0 && solvedCount === problemCount && (
                        <span className="badge badge-success badge-sm gap-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {solvedCount}/{problemCount}
                        </span>
                      )}
                      {solvedCount > 0 && solvedCount < problemCount && (
                        <span className="badge badge-warning badge-sm shadow-sm">
                          {solvedCount}/{problemCount}
                        </span>
                      )}
                      {solvedCount === 0 && (
                        <span className="badge badge-ghost badge-sm">{problemCount}</span>
                      )}
                    </div>
                  </div>
                  {/* Enhanced Progress bar with label */}
                  {problemCount > 0 && (
                    <div className="space-y-1">
                      <div className="w-full bg-base-300/50 rounded-full h-1.5 shadow-inner overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                            solvedCount === problemCount
                              ? 'bg-gradient-to-r from-success to-success shadow-sm'
                              : 'bg-gradient-to-r from-primary to-primary/70'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              }
            >
              <div className="space-y-1 mt-2">
                {topicProblems.map((problem, index) => {
                  const isActive = pathname === `/problems/${problem.slug}`;
                  const isSolved = solvedProblemsMap[problem.id];
                  const diffColor = getDifficultyColor(problem.difficulty);

                  // Difficulty badge config
                  const difficultyBadge = problem.difficulty ? {
                    Easy: { color: 'badge-success', text: 'Easy' },
                    Medium: { color: 'badge-warning', text: 'Med' },
                    Hard: { color: 'badge-error', text: 'Hard' }
                  }[problem.difficulty] : null;

                  return (
                    <Menu.Item key={`${problem.slug}-menu-item`}>
                      <Link
                        className={`group text-sm font-normal flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-content shadow-lg scale-[1.02]'
                            : 'hover:bg-base-200/80 hover:shadow-sm hover:scale-[1.01]'
                        }`}
                        href={`/problems/${problem.slug}`}
                        key={problem.slug}
                        title={problem.title}
                      >
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {isSolved ? (
                            <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="w-3.5 h-3.5 stroke-success stroke-[3]"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isActive ? 'border-primary-content/50' : 'border-base-content/20'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-primary-content/30' : ''
                              }`}></div>
                            </div>
                          )}
                        </div>

                        {/* Problem Title */}
                        <span className={`flex-1 truncate ${
                          isActive ? 'font-semibold' : 'font-normal'
                        } ${!isSolved && !isActive ? 'text-base-content/90' : ''}`}>
                          {problem.title}
                        </span>

                        {/* Metadata */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Difficulty Badge */}
                          {difficultyBadge && (
                            <span className={`badge ${difficultyBadge.color} badge-xs font-semibold ${
                              isActive ? 'badge-outline' : ''
                            }`}>
                              {difficultyBadge.text}
                            </span>
                          )}
                          {/* Problem Number */}
                          <span className={`text-xs font-mono ${
                            isActive ? 'text-primary-content/60' : 'text-base-content/40'
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                      </Link>
                    </Menu.Item>
                  );
                })}
              </div>
            </Menu.Details>
          );
        })}
      </Menu>

      {/* No results message - Enhanced */}
      {searchQuery && filteredTopics.length === 0 && (
        <div className="card bg-base-200/50 border border-dashed border-base-content/20">
          <div className="card-body items-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-base-300/50 flex items-center justify-center mb-4">
              <FaSearch className="w-7 h-7 text-base-content/30" />
            </div>
            <h3 className="text-base font-semibold text-base-content mb-1">No problems found</h3>
            <p className="text-xs text-base-content/60 max-w-[200px]">
              Try searching with different keywords or browse all topics
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn btn-sm btn-ghost mt-4"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
