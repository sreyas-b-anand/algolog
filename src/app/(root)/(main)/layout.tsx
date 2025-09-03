import Navbar from "@/src/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlgoLog",
  description: "Your competitive programming companion",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar Navigation */}
      <div className="fixed left-0 h-screen w-64 border-r border-border bg-card">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-auto">
        <main className="container px-6 py-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
