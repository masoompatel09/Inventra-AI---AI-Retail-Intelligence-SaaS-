"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, ApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const { access_token } = await loginUser(email, password);
            setToken(access_token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't log in — try again");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-2xl font-semibold text-ink">Inventra AI</h1>
                    <p className="mt-1 text-sm text-ink-muted">Log in to your workspace</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-border bg-surface p-6 shadow-sm"
                >
                    {error && (
                        <div className="mb-4 rounded-md border border-alert-red/30 bg-alert-red/10 px-3 py-2 text-sm text-alert-red">
                            {error}
                        </div>
                    )}

                    <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="you@company.com"
                    />

                    <label className="mb-1 block text-sm font-medium text-ink" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6 w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in…" : "Log in"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-ink-muted">
                    New to Inventra?{" "}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Create a workspace
                    </Link>
                </p>
            </div>
        </main>
    );
}