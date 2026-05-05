"use client";

import { useEffect, useState } from "react";
import { Home, Folder, PlusCircle, User } from "lucide-react";
import Link from "next/link";

export default function PwaBottomMenu() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true; // iOS Safari

    setIsPwa(standalone);
  }, []);

  if (!isPwa) return null;

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full  px-4 py-2 shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-between">
       
      <Link href="/resources/projects" className="flex flex-col items-center text-xs">
          <Folder size={22} />
          <span>Projects</span>
        </Link>
        <Link href="/resources/projects" className="flex flex-col items-center text-xs">
          <Folder size={22} />
          <span>Projects</span>
        </Link>

        <Link href="/resources/projects" className="flex flex-col items-center text-xs">
          <PlusCircle size={26} />
          <span>Add transaction</span>
        </Link>

        <Link href="/resources/profile" className="flex flex-col items-center text-xs">
          <User size={22} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}