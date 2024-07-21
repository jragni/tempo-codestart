import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import { Navbar, Sidebar } from "@containers"

const inter = Raleway({
  subsets: ["latin"],
  weight: ['400','500','600','700','800','900'],
});

export const metadata: Metadata = {
  title: "Tempo Codestart",
  description: "Prepare for your coding bootcamp with Tempo Codestart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar />
        <div className="flex w-full pt-[64px]">
					<Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
