"use client"

import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { File, Home, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-card text-foreground flex flex-col justify-between h-screen py-4 w-64">
      <div className="space-y-6">
        {/* Header */}
        <header className="px-4 space-y-4">
          <div className="flex items-center gap-3">
            <Image
              className="rounded-full"
              src={logo}
              alt="AlgoLog Logo"
              width={40}
              height={40}
              priority
            />
            <h1 className="text-lg font-semibold text-primary">AlgoLog</h1>
          </div>
          <div className="h-px bg-border/60" />
        </header>

        {/* Navigation */}
        <nav className="space-y-1 px-2">
          <Link href="/dashboard">
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-accent text-primary"
                  : "text-foreground/80 hover:bg-accent/50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </div>
          </Link>

          <Link href="/add">
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/add"
                  ? "bg-accent text-primary"
                  : "text-foreground/80 hover:bg-accent/50"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add</span>
            </div>
          </Link>


          <Link href="/export">
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/export"
                  ? "bg-accent text-primary"
                  : "text-foreground/80 hover:bg-accent/50"
              }`}
            >
              <File className="w-4 h-4" />
              <span>Export</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <footer className="px-4 pb-4">
        <div className="h-px bg-border/60 mb-4" />
        <p className="text-sm text-foreground/60 text-center">
          &copy; {new Date().getFullYear()} AlgoLog
        </p>
      </footer>
    </div>
  );
};

export default Navbar;
