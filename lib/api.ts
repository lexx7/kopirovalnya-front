import type {
  PublicCategory,
  PublicLayout,
  PublicPage,
  PublicPageListItem,
  PublicProduct,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    path: string,
  ) {
    super(`API ${status}: ${path}`);
  }
}

export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}/api/public${path}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json() as Promise<T>;
}

export const getLayout = () => apiGet<PublicLayout>("/layout");

export const getPages = () => apiGet<PublicPageListItem[]>("/pages");

export const getPage = (slug: string) =>
  apiGet<PublicPage>(`/pages${slug.startsWith("/") ? slug : `/${slug}`}`);

export const getCategories = () => apiGet<PublicCategory[]>("/categories");

export const getProducts = (category?: string) =>
  apiGet<PublicProduct[]>(`/products${category ? `?category=${encodeURIComponent(category)}` : ""}`);

export const getProduct = (slug: string) =>
  apiGet<PublicProduct>(`/products/${encodeURIComponent(slug)}`);
