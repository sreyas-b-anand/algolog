import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { File, Home, Logs, PlusCircle } from "lucide-react";
const Navbar = () => {
  return (
    <div className="bg-navbar text-foreground flex flex-col h-screen w-[200px]">
      <header className="flex items-center justify-start gap-2 p-3 border-b border-border">
        <Image
          className="rounded-full "
          src={logo}
          alt=""
          width={45}
          height={45}
        />
        <p>AlgoLog</p>
      </header>
      <nav className="flex flex-col gap-3 p-3">
        <Link
          className="w-full flex items-center justify-start px-3 gap-2 "
          href={"/dashboard"}
        >
          <Home /> Home
        </Link>
        <Link
          className="w-full flex items-center justify-start px-3 gap-2 "
          href={"/add"}
        >
          <PlusCircle /> Add
        </Link>
        <Link
          className="w-full flex items-center justify-start px-3 gap-2 "
          href={"/logs"}
        >
          <Logs />
          Logs
        </Link>
        <Link
          className="w-full flex items-center justify-start px-3 gap-2 "
          href={"/revision"}
        >
          <File /> Revision
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
