"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
    {
        label: "Documents",
        href: "/documents",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
            >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M9 9h1M9 13h6M9 17h6" />
            </svg>
        ),
    },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="flex w-64 flex-col bg-sidebar text-sidebar-foreground">
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-5 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    E
                </div>
                <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">ERP Demo</p>
                    <p className="text-xs text-sidebar-muted">Hospital</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                    Menu
                </p>

                {NAV_ITEMS.map((item) => {
                    const active =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-sidebar-active text-white"
                                    : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
                            }`}
                        >
                            {active && (
                                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-primary" />
                            )}
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer (mock) */}
            <div className="border-t border-white/10 px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-hover text-sm font-semibold text-white">
                        JS
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-medium text-white">
                            Jirapat S.
                        </p>
                        <p className="text-xs text-sidebar-muted">Staff</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
