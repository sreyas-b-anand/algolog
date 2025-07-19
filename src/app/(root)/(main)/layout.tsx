import Navbar from "@/src/components/Navbar";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "AlgoLog",
  description: "Your competitive programming companion",
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div className="flex">
          <Navbar />
          <div className="flex-1 py-3 px-3">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default layout;
