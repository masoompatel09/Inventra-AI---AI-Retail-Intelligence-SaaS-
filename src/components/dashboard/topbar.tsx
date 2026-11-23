"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getMyCompany, getCurrentUser, CompanyRead, UserRead } from "@/lib/api";
import { clearToken } from "@/lib/auth";

export function Topbar() {
    const router = useRouter();
    const [company, setCompany] = useState<CompanyRead | null>(null);
    const [user, setUser] = useState<UserRead | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        getMyCompany().then(setCompany).catch(() => { });
        getCurrentUser().then(setUser).catch(() => { });
    }, []);

    function handleLogout() {
        clearToken();
        router.push("/login");
    }

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
                <div>
                    <p className="text-sm font-medium text-ink">{company?.name ?? "Loading…"}</p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-ink-muted">{user?.full_name}</span>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas hover:text-alert-red"
                    >
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            </header>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg">
                        <h2 className="font-display text-lg font-semibold text-ink">Log out?</h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            You&apos;ll need to log in again to access your dashboard.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="rounded-md bg-alert-red px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}