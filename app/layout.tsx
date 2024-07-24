import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import { auth } from "@/auth";
import { Navbar, Sidebar } from "@containers"
import { User } from "@/app/definitions";

import { handleUserPostAuth } from "./actions";

const inter = Raleway({
  subsets: ["latin"],
  weight: ['400','500','600','700','800','900'],
});

export const metadata: Metadata = {
  title: "Tempo Codestart",
  description: "Prepare for your coding bootcamp with Tempo Codestart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  let user = session ?  await handleUserPostAuth(session) as User : null;

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar user={user} />
        <div className="flex w-full pt-[64px]">
          <Sidebar user={user} />
          {children}
        </div>
      </body>
    </html>
  );
}
