import Navbar from "@/src/components/Navbar";
import Topbar from "@/src/components/Sidebar"; // 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlgoLog",
  description: "Your competitive programming companion",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar (Desktop only) */}
      <div className="hidden md:block fixed left-0 h-screen w-64 border-r border-border bg-card">
        <Navbar />
      </div>

      {/* Topbar (Mobile only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 border-b border-border bg-card z-50">
        <Topbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64">
        {/* Padding top for mobile so content doesn't hide behind topbar */}
        <main className="container px-6 py-8 md:pt-8 pt-20 flex items-center justify-center md:block">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
