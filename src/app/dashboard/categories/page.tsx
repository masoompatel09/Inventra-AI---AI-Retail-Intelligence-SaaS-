"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getCategories, deleteCategory, createCategory, updateCategory, CategoryRead, ApiError } from "@/lib/api";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryRead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryRead | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryRead | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function loadCategories() {
        setIsLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    function openAddModal() {
        setEditingCategory(null);
        setName("");
        setDescription("");
        setFormError(null);
        setModalOpen(true);
    }

    function openEditModal(category: CategoryRead) {
        setEditingCategory(category);
        setName(category.name);
        setDescription(category.description ?? "");
        setFormError(null);
        setModalOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, { name, description: description || null });
            } else {
                await createCategory({ name, description: description || null });
            }
            setModalOpen(false);
            loadCategories();
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : "Couldn't save category — try again");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleteError(null);
        try {
            await deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
            loadCategories();
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete category");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
                    <p className="mt-1 text-sm text-ink-muted">Organize your products into categories.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
                {isLoading ? (
                    <p className="p-6 text-center text-sm text-ink-muted">Loading categories…</p>
                ) : categories.length === 0 ? (
                    <p className="p-10 text-center text-sm text-ink-muted">
                        No categories yet — add your first one to get started.
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-ink-muted">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Description</th>
                                <th className="px-4 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3 text-ink">{category.name}</td>
                                    <td className="px-4 py-3 text-ink-muted">{category.description ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas hover:text-primary"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(category)}
                                                className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas hover:text-alert-red"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg">
                        <h2 className="font-display text-lg font-semibold text-ink">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-4">
                            {formError && (
                                <div className="mb-4 rounded-md border border-alert-red/30 bg-alert-red/10 px-3 py-2 text-sm text-alert-red">
                                    {formError}
                                </div>
                            )}

                            <label className="mb-1 block text-sm font-medium text-ink">Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mb-4 w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />

                            <label className="mb-1 block text-sm font-medium text-ink">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="mb-6 w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving…" : editingCategory ? "Save Changes" : "Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg">
                        <h2 className="font-display text-lg font-semibold text-ink">Delete category?</h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            &quot;{deleteTarget.name}&quot; will be permanently removed.
                        </p>
                        {deleteError && (
                            <div className="mt-3 rounded-md border border-alert-red/30 bg-alert-red/10 px-3 py-2 text-sm text-alert-red">
                                {deleteError}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-md bg-alert-red px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}