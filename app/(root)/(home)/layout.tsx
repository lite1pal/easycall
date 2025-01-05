import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col p-5 lg:p-10">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}

export default HomeLayout;
