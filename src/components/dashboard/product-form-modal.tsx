"use client";

import { useState, useEffect } from "react";
import {
    ProductRead,
    ProductCreate,
    CategoryRead,
    createProduct,
    updateProduct,
    getCategories,
    ApiError,
} from "@/lib/api";

interface ProductFormModalProps {
    product: ProductRead | null;
    onClose: () => void;
    onSaved: () => void;
}

export function ProductFormModal({ product, onClose, onSaved }: ProductFormModalProps) {
    const isEditMode = product !== null;

    const [categories, setCategories] = useState<CategoryRead[]>([]);
    const [name, setName] = useState(product?.name ?? "");
    const [sku, setSku] = useState(product?.sku ?? "");
    const [categoryId, setCategoryId] = useState(product?.category?.id.toString() ?? "");
    const [price, setPrice] = useState(product?.price.toString() ?? "");
    const [costPrice, setCostPrice] = useState(product?.cost_price?.toString() ?? "");
    const [quantity, setQuantity] = useState(product?.quantity.toString() ?? "0");
    const [reorderPoint, setReorderPoint] = useState(product?.reorder_point.toString() ?? "10");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        getCategories().then(setCategories).catch(() => { });
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const payload: ProductCreate = {
            name,
            sku,
            category_id: categoryId ? parseInt(categoryId, 10) : null,
            price: parseFloat(price),
            cost_price: costPrice ? parseFloat(costPrice) : null,
            quantity: parseInt(quantity, 10),
            reorder_point: parseInt(reorderPoint, 10),
        };

        try {
            if (isEditMode) {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
            }
            onSaved();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't save product — try again");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
            <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg">
                <h2 className="font-display text-lg font-semibold text-ink">
                    {isEditMode ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4">
                    {error && (
                        <div className="mb-4 rounded-md border border-alert-red/30 bg-alert-red/10 px-3 py-2 text-sm text-alert-red">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium text-ink">Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">SKU</label>
                            <input
                                required
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Uncategorized</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">Price</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">Cost Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">Quantity</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-ink">Reorder Point</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={reorderPoint}
                                onChange={(e) => setReorderPoint(e.target.value)}
                                className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving…" : isEditMode ? "Save Changes" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}