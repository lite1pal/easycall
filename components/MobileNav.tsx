"use client";

import Image from "next/image";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function MobileNav() {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={24}
            height={24}
            alt="hamburger"
            className="sm:hidden"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col border-none bg-dark-1 text-white">
          <SheetClose asChild>
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="max-sm:size-10"
              />
              <p className="text-[26px] font-bold text-white">EasyCall</p>
            </Link>
          </SheetClose>

          <div className="flex flex-1 flex-col gap-6 pt-16">
            {sidebarLinks.map((link) => {
              // let activeClassName = "";
              // if (link.route === pathName) {
              //   activeClassName = "text-indigo-600";
              // }
              const isActive = pathName === link.route;

              return (
                <SheetClose asChild key={link.label}>
                  <Link
                    href={link.route}
                    className={cn(
                      "flex items-center justify-start gap-4 rounded-lg p-4",
                      { "bg-blue-1": isActive },
                    )}
                  >
                    <Image
                      width={20}
                      height={20}
                      src={link.imgUrl}
                      alt="Image"
                    />
                    <p className="text-md font-semibold">{link.label}</p>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;
