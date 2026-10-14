"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiDelete, apiGet, ApiError } from "@/lib/admin/api";
import type { PageListItem } from "@/lib/admin/types";

export default function PagesListPage() {
  const [pages, setPages] = useState<PageListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<PageListItem[]>("/api/admin/pages")
      .then(setPages)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Ошибка загрузки")
      );
  }, []);

  async function onDelete(p: PageListItem) {
    if (!window.confirm(`Удалить страницу «${p.title}» (${p.slug})?`)) return;
    setError(null);
    try {
      await apiDelete(`/api/admin/pages/${p.id}`);
      setPages((prev) => (prev ? prev.filter((x) => x.id !== p.id) : prev));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка удаления");
    }
  }

  return (
    <>
      <div className="admin-row" style={{ marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>Страницы</h1>
        <span style={{ flex: 1 }} />
        <Link href="/admin/pages/new" className="admin-btn">
          + Новая страница
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {!pages && !error && <p>Загрузка…</p>}

      {pages && pages.length === 0 && <p className="admin-muted">Страниц пока нет</p>}

      {pages && pages.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Заголовок</th>
              <th>Статус</th>
              <th>Сортировка</th>
              <th>Обновлена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>
                  <code>{p.slug}</code>
                </td>
                <td>{p.title}</td>
                <td>
                  {p.published ? (
                    <span className="admin-badge admin-badge--green">Опубликована</span>
                  ) : (
                    <span className="admin-badge">Черновик</span>
                  )}
                </td>
                <td>{p.sortOrder}</td>
                <td>{new Date(p.updatedAt).toLocaleString("ru-RU")}</td>
                <td>
                  <div className="admin-row">
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="admin-btn admin-btn--secondary admin-btn--small"
                    >
                      Править
                    </Link>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--small"
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
      )}
    </>
  );
}
