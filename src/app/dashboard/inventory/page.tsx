"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getProducts, deleteProduct, ProductRead } from "@/lib/api";
import { ProductFormModal } from "@/components/dashboard/product-form-modal";

export default function InventoryPage() {
    const [products, setProducts] = useState<ProductRead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductRead | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductRead | null>(null);

    async function loadProducts() {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    function openAddModal() {
        setEditingProduct(null);
        setModalOpen(true);
    }

    function openEditModal(product: ProductRead) {
        setEditingProduct(product);
        setModalOpen(true);
    }

    function handleSaved() {
        setModalOpen(false);
        loadProducts();
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        await deleteProduct(deleteTarget.id);
        setDeleteTarget(null);
        loadProducts();
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">Inventory</h1>
                    <p className="mt-1 text-sm text-ink-muted">Manage your products and stock levels.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
                {isLoading ? (
                    <p className="p-6 text-center text-sm text-ink-muted">Loading products…</p>
                ) : products.length === 0 ? (
                    <p className="p-10 text-center text-sm text-ink-muted">
                        No products yet — add your first one to get started.
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-ink-muted">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">SKU</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Price</th>
                                <th className="px-4 py-3 font-medium">Quantity</th>
                                <th className="px-4 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const isLowStock = product.quantity <= product.reorder_point;
                                return (
                                    <tr key={product.id} className="border-b border-border last:border-0">
                                        <td className="px-4 py-3 text-ink">{product.name}</td>
                                        <td className="px-4 py-3 font-mono-data text-ink-muted">{product.sku}</td>
                                        <td className="px-4 py-3 text-ink-muted">
                                            {product.category?.name ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 font-mono-data text-ink">
                                            ₹{product.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`font-mono-data ${isLowStock ? "font-medium text-signal-amber" : "text-ink"
                                                    }`}
                                            >
                                                {product.quantity}
                                            </span>
                                            {isLowStock && (
                                                <span className="ml-2 rounded-full bg-signal-amber/10 px-2 py-0.5 text-xs font-medium text-signal-amber">
                                                    Low stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas hover:text-primary"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(product)}
                                                    className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas hover:text-alert-red"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <ProductFormModal
                    product={editingProduct}
                    onClose={() => setModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg">
                        <h2 className="font-display text-lg font-semibold text-ink">Delete product?</h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            &quot;{deleteTarget.name}&quot; will be removed from your inventory. This can&apos;t be undone.
                        </p>
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