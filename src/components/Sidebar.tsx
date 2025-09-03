"use client";

import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { File, Home, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const Topbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-card text-foreground fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src={logo}
            alt="AlgoLog Logo"
            width={32}
            height={32}
            priority
          />
          <h1 className="text-base font-semibold text-primary">AlgoLog</h1>
        </div>

        {/* Nav links (inline icons for mobile) */}
        <nav className="flex items-center gap-6">
          <Link href="/dashboard">
            <div
              className={`flex flex-col items-center text-xs ${
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary"
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/add">
            <div
              className={`flex flex-col items-center text-xs ${
                pathname === "/add"
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/export">
            <div
              className={`flex flex-col items-center text-xs ${
                pathname === "/export"
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary"
              }`}
            >
              <File className="w-5 h-5" />
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
