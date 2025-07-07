import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { File, Home, Logs, PlusCircle } from "lucide-react";
const Navbar = () => {
  return (
    <div className="bg-navbar text-foreground flex flex-col justify-between h-screen py-3 w-[200px]">
      <div>
        <header className="flex items-center justify-start gap-2  flex-col">
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full "
              src={logo}
              alt=""
              width={45}
              height={45}
            />
            <p>AlgoLog</p>
          </div>
          <div className="w-[95%] bg-border h-[0.2px] " />
        </header>
        <nav className="flex flex-col gap-3 p-3">
          <Link
            className="w-full flex items-center justify-start px-3 gap-3 hover:opacity-80 transition-opacity hover:bg-accent"
            href={"/dashboard"}
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            className="w-full flex items-center justify-start px-3 gap-2 "
            href={"/add"}
          >
            <PlusCircle className="w-4 h-4" /> Add
          </Link>
          <Link
            className="w-full flex items-center justify-start px-3 gap-2 "
            href={"/logs"}
          >
            <Logs className="w-4 h-4" />
            Logs
          </Link>
          <Link
            className="w-full flex items-center justify-start px-3 gap-2 "
            href={"/revision"}
          >
            <File className="w-4 h-4" /> Revision
          </Link>
        </nav>
      </div>
      <footer className="w-full flex items-center flex-col justify-center text-center gap-3">
        {" "}
        <div className="bg-border h-[0.2px] w-[95%]" />
        <p>&copy; AlgoLog</p>
      </footer>
    </div>
  );
};

export default Navbar;
