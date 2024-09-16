/**
 * SidebarMenu component
 */
import Link from "next/link";
import { Menu } from "react-daisyui";

import { Problem } from "../Workspace/definitions";
import { topicsList } from "./constants";

interface SidebarMenuProps {
  problems: Problem[];
}

export default function SidebarMenu({ problems }: SidebarMenuProps) {
  return (
    <Menu className="">
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
  );
}
