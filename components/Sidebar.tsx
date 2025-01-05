"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathName = usePathname();

  return (
    <section className="bg-dark-1 sticky left-0 top-0 flex h-screen flex-col justify-between p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          let activeClassName = "";
          if (link.route === pathName) {
            activeClassName = "text-indigo-600";
          }
          const isActive = pathName === link.route;

          return (
            <Link
              key={link.label}
              href={link.route}
              className={cn(
                "flex items-center justify-start gap-4 rounded-lg p-4",
                { "bg-blue-1": isActive },
              )}
            >
              <Image width={24} height={24} src={link.imgUrl} alt="Image" />
              <p className="text-lg font-semibold max-lg:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Sidebar;
