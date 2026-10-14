"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiDelete, apiGet } from "@/lib/admin/api";
import type { CategoryDto, ProductDto } from "@/lib/admin/types";

export default function ProductsPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<CategoryDto[]>("/api/admin/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const url = categoryId
        ? `/api/admin/products?categoryId=${encodeURIComponent(categoryId)}`
        : "/api/admin/products";
      setProducts(await apiGet<ProductDto[]>(url));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(product: ProductDto) {
    if (!window.confirm(`Удалить товар «${product.name}»?`)) return;
    setError(null);
    try {
      await apiDelete(`/api/admin/products/${product.id}`);
      await loadProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось удалить товар");
    }
  }

  return (
    <>
      <div className="admin-row" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Товары</h1>
        <Link className="admin-btn" href="/admin/products/new">
          + Новый товар
        </Link>
      </div>

      <div className="admin-card">
        <label className="admin-field" style={{ maxWidth: 320, marginBottom: 0 }}>
          <span>Рубрика</span>
          <select
            className="admin-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Все рубрики</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading ? (
        <p className="admin-muted">Загрузка…</p>
      ) : products.length === 0 ? (
        <p className="admin-muted">Товаров не найдено</p>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Рубрика</th>
                <th>Цена</th>
                <th>Статус</th>
                <th>Сортировка</th>
                <th style={{ width: 180 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>
                    <code>{p.slug}</code>
                  </td>
                  <td>{p.categoryName ?? <span className="admin-muted">—</span>}</td>
                  <td>{p.price !== null ? `${p.price} ₽` : "—"}</td>
                  <td>
                    <span className={p.published ? "admin-badge admin-badge--green" : "admin-badge"}>
                      {p.published ? "Опубликован" : "Скрыт"}
                    </span>
                  </td>
                  <td>{p.sortOrder}</td>
                  <td>
                    <div className="admin-row">
                      <Link
                        className="admin-btn admin-btn--secondary admin-btn--small"
                        href={`/admin/products/${p.id}`}
                      >
                        Править
                      </Link>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--small"
                        type="button"
                        onClick={() => void onDelete(p)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
