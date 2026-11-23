"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserRead } from "@/lib/api";

export default function DashboardPage() {
    const [user, setUser] = useState<UserRead | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUser).catch(() => { });
    }, []);

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
                Welcome{user ? `, ${user.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
                Here&apos;s what&apos;s happening with your business.
            </p>

            <div className="mt-8 rounded-lg border border-dashed border-border bg-surface p-10 text-center">
                <p className="text-sm text-ink-muted">
                    Your inventory and sales overview will show up here once you start adding products.
                </p>
            </div>
        </div>
    );
}