"use client";

import { useEffect, useState } from "react";
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from "@/lib/admin/api";
import type { CategoryDto } from "@/lib/admin/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setCategories(await apiGet<CategoryDto[]>("/api/admin/categories"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить рубрики");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditing(null);
    setSlug("");
    setName("");
    setSortOrder("0");
    setFormError(null);
  }

  function startEdit(category: CategoryDto) {
    setEditing(category);
    setSlug(category.slug);
    setName(category.name);
    setSortOrder(String(category.sortOrder));
    setFormError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const body = { slug: slug.trim(), name: name.trim(), sortOrder: Number(sortOrder) || 0 };
    try {
      if (editing) {
        await apiPut(`/api/admin/categories/${editing.id}`, body);
      } else {
        await apiPost("/api/admin/categories", body);
      }
      resetForm();
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFormError("Рубрика с таким slug уже существует");
      } else {
        setFormError(err instanceof ApiError ? err.message : "Не удалось сохранить рубрику");
      }
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(category: CategoryDto) {
    if (!window.confirm(`Удалить рубрику «${category.name}»?`)) return;
    setError(null);
    try {
      await apiDelete(`/api/admin/categories/${category.id}`);
      if (editing?.id === category.id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось удалить рубрику");
    }
  }

  return (
    <>
      <h1>Рубрики</h1>

      <div className="admin-card">
        <form onSubmit={onSubmit}>
          <div className="admin-row" style={{ alignItems: "flex-end" }}>
            <label className="admin-field" style={{ flex: 1, minWidth: 180 }}>
              <span>Slug</span>
              <input
                className="admin-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                pattern="[a-zA-Z0-9_-]+"
                title="Латиница, цифры, дефис и подчёркивание"
                required
              />
            </label>
            <label className="admin-field" style={{ flex: 2, minWidth: 220 }}>
              <span>Название</span>
              <input
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="admin-field" style={{ width: 120 }}>
              <span>Сортировка</span>
              <input
                className="admin-input"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </label>
            <div className="admin-field">
              <button className="admin-btn" type="submit" disabled={saving}>
                {saving ? "Сохранение…" : editing ? "Сохранить" : "Добавить"}
              </button>
            </div>
            {editing && (
              <div className="admin-field">
                <button
                  className="admin-btn admin-btn--secondary"
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
          {formError && <p className="admin-error">{formError}</p>}
        </form>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading ? (
        <p className="admin-muted">Загрузка…</p>
      ) : categories.length === 0 ? (
        <p className="admin-muted">Рубрик пока нет</p>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Название</th>
                <th>Сортировка</th>
                <th style={{ width: 180 }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <code>{c.slug}</code>
                  </td>
                  <td>{c.name}</td>
                  <td>{c.sortOrder}</td>
                  <td>
                    <div className="admin-row">
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--small"
                        type="button"
                        onClick={() => startEdit(c)}
                      >
                        Править
                      </button>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--small"
                        type="button"
                        onClick={() => void onDelete(c)}
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
