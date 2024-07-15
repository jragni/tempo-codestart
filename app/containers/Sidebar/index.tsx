/**
 * Sidebar
 */
import { auth } from "@/auth";
import { ImMenu } from "react-icons/im";

export default async function Sidebar() {
  const session = await auth();

  return session && (
    <section className="drawer bg-neutral h-[calc(100dvh-64px)] w-fit">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-neutral drawer-button w-full">
          <ImMenu size={16} />
        </label>
      </div>
      <div className="drawer-side mt-[64px] z-[6000]">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        {/* TODO add problem section drop down */}
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        </ul>
      </div>
    </section>
  )
}