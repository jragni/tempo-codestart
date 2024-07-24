"use client";
import { ImMenu } from "react-icons/im"
import { Menu } from "react-daisyui";
import Link from 'next/link';

import { usePathname } from "next/navigation"

import { Problem } from "../Workspace/definitions";
import { User } from "@/app/definitions";

import { topicsList } from "./constants";

interface ClientSidebarProps {
  problems: Problem[];
  user?: User | null;
}

export default function ClientSidebar({ problems, user }: ClientSidebarProps) {
  if (usePathname() === '/') return null;


  return (
    <section className="drawer bg-neutral min-h-[calc(100dvh)] w-fit min-w-[47px]">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-neutral drawer-button w-full">
          <ImMenu size={16} />
        </label>
      </div>
      <div className="drawer-side mt-[64px] z-[6000]">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Menu className="menu bg-neutral text-base-content grow min-h-screen w-80 p-4">
          {topicsList.map(topic => (
            <Menu.Details
              key={`${topic}-sidebar-menu-problems`}
              label={<span className="text-xl font-bold">{topic}</span>}
            >
              {problems.sort((a, b) => Number(a.id) - Number(b.id))
                .filter(problem => problem.topic === topic.toLowerCase())
                .map(problem => (
                  <Menu.Item  key={`${problem.slug}-menu-item`}>
                    <Link
                      className='text-lg font-thin'
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
      </div>
    </section>
  )
}