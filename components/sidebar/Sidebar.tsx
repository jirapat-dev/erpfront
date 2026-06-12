"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  const userId = process.env.NEXT_PUBLIC_USER_ID_MOCK;
  const personalInfoUrl = `/personal-info/${userId}`;
  const editUserUrl = `/edit-user/${userId}`;

  return (
    <aside className="w-64 bg-slate-800 text-white p-4">
      <h2 className="mb-6 text-xl font-bold">ERP Demo</h2>

      <Link
        href={personalInfoUrl}
        className={`block rounded px-3 py-2 ${
          pathname === personalInfoUrl ? "bg-slate-700" : "hover:bg-slate-700"
        }`}
      >
        Personal Info
      </Link>

      <Link
        href={'/create-user'}
        className={`block rounded px-3 py-2 ${
          pathname === '/create-user' ? "bg-slate-700" : "hover:bg-slate-700"
        }`}
      >
        Create User
      </Link>

      <Link
        href={editUserUrl}
        className={`block rounded px-3 py-2 ${
          pathname === editUserUrl ? "bg-slate-700" : "hover:bg-slate-700"
        }`}
      >
        Edit User
      </Link>
    </aside>
  );
}