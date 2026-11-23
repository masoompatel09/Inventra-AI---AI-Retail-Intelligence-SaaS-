import { clearToken, getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface HealthResponse {
    status: string;
    service: string;
}

export interface UserRead {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    role_id: number;
    company_id: number;
}

export interface CompanyRead {
    id: number;
    name: string;
    business_type: string | null;
    address: string | null;
    is_active: boolean;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface CategoryRead {
    id: number;
    name: string;
    description: string | null;
}

export interface CategoryCreate {
    name: string;
    description?: string | null;
}

export interface CategoryUpdate {
    name?: string;
    description?: string | null;
}

export interface ProductRead {
    id: number;
    name: string;
    sku: string;
    category: CategoryRead | null;
    price: number;
    cost_price: number | null;
    quantity: number;
    reorder_point: number;
    is_active: boolean;
}

export interface ProductCreate {
    name: string;
    sku: string;
    category_id?: number | null;
    price: number;
    cost_price?: number | null;
    quantity?: number;
    reorder_point?: number;
}

export interface ProductUpdate {
    name?: string;
    sku?: string;
    category_id?: number | null;
    price?: number;
    cost_price?: number | null;
    quantity?: number;
    reorder_point?: number;
}

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {},
    authenticated = false
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (authenticated) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (response.status === 401) {
        clearToken();
        throw new ApiError(401, "Session expired, please log in again");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new ApiError(response.status, body.detail ?? "Something went wrong");
    }

    return response.json() as Promise<T>;
}

export async function getApiHealth(): Promise<HealthResponse> {
    try {
        return await request<HealthResponse>("/api/v1/health");
    } catch {
        return { status: "unreachable", service: "Inventra AI API" };
    }
}

export async function registerUser(payload: {
    email: string;
    password: string;
    full_name: string;
    company_name: string;
}): Promise<UserRead> {
    return request<UserRead>("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
    const body = new URLSearchParams({ username: email, password });
    return request<TokenResponse>("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });
}

export async function getCurrentUser(): Promise<UserRead> {
    return request<UserRead>("/api/v1/auth/me", {}, true);
}

export async function getMyCompany(): Promise<CompanyRead> {
    return request<CompanyRead>("/api/v1/companies/me", {}, true);
}

export async function getProducts(): Promise<ProductRead[]> {
    return request<ProductRead[]>("/api/v1/products", {}, true);
}

export async function createProduct(payload: ProductCreate): Promise<ProductRead> {
    return request<ProductRead>(
        "/api/v1/products",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        },
        true
    );
}

export async function updateProduct(id: number, payload: ProductUpdate): Promise<ProductRead> {
    return request<ProductRead>(
        `/api/v1/products/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        },
        true
    );
}

export async function deleteProduct(id: number): Promise<void> {
    return request<void>(`/api/v1/products/${id}`, { method: "DELETE" }, true);
}

export async function getCategories(): Promise<CategoryRead[]> {
    return request<CategoryRead[]>("/api/v1/categories", {}, true);
}

export async function createCategory(payload: CategoryCreate): Promise<CategoryRead> {
    return request<CategoryRead>(
        "/api/v1/categories",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        },
        true
    );
}

export async function updateCategory(id: number, payload: CategoryUpdate): Promise<CategoryRead> {
    return request<CategoryRead>(
        `/api/v1/categories/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        },
        true
    );
}

export async function deleteCategory(id: number): Promise<void> {
    return request<void>(`/api/v1/categories/${id}`, { method: "DELETE" }, true);
}