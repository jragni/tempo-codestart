/**
 * Problem not found
 */
import Image from "next/image";
import Link from "next/link";
import HeaderImage from "public/foundations-bg-image.jpeg"

export default function ProblemNotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-[100vw] h-[calc(100dvh-68px)]">
      <Image className="m-10" src={HeaderImage} alt="Problem not found" height={500} />
      <h1 className="text-3xl">404 - page not found</h1>
      <Link
        className="btn btn-info btn-outline mt-4"
        href="/"
      >Let's go back home</Link>
    </div>
  );
}