"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Folder, Plus, User } from "lucide-react";
import Link from "next/link";

export default function PwaBottomMenu() {
  const [isPwa, setIsPwa] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsPwa(standalone);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 10);

      if (y > lastScrollY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!isPwa) return null;

  const base =
    "flex flex-col items-center gap-1 text-xs transition-all duration-200 active:scale-90";

  const inactive = "text-[#717887]";
  const active = "text-[#62748e] scale-110 -translate-y-1";

  return (
    <nav
      className={`
        glass-noise
        relative
        fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2
        rounded-3xl border border-white/30
        px-5 py-3
        backdrop-blur-xl
        transition-all duration-300 ease-out
        ${
          scrolled
            ? "bg-white/40 shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            : "bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        }
        ${hidden ? "translate-y-28 opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div className="relative z-10 flex items-center justify-between">
       

        <Link href="resources/projects" className={`${base} ${pathname === "/projects" ? active : inactive}`}>
          <Folder size={22} />
          <span>Projects</span>
        </Link>

        <Link
          href="/resources/projects"
          className="flex -translate-y-4 items-center justify-center rounded-full bg-[#62748e] p-4 text-white shadow-lg transition active:scale-90"
        >
          <Plus size={26} />
          <span>Transaction</span>
        </Link>

        <Link href="/resources/profile" className={`${base} ${pathname === "/profile" ? active : inactive}`}>
          <User size={22} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}