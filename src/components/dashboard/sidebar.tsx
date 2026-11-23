"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/categories", label: "Categories", icon: Tag },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-56 flex-col border-r border-border bg-surface">
            <div className="flex h-16 items-center border-b border-border px-5">
                <span className="font-display text-lg font-semibold text-ink">Inventra AI</span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-ink-muted hover:bg-canvas hover:text-ink"
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}