"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut, ApiError } from "@/lib/admin/api";
import type { MenuItem, PageListItem } from "@/lib/admin/types";

type Location = "HEADER" | "FOOTER";
type LinkMode = "page" | "url";

interface FormState {
  id: string | null;
  label: string;
  location: Location;
  parentId: string;
  linkMode: LinkMode;
  pageId: string;
  url: string;
}

const emptyForm = (location: Location): FormState => ({
  id: null,
  label: "",
  location,
  parentId: "",
  linkMode: "page",
  pageId: "",
  url: "",
});

const byOrder = (a: MenuItem, b: MenuItem) => a.sortOrder - b.sortOrder;

export default function MenuPage() {
  const [location, setLocation] = useState<Location>("HEADER");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm("HEADER"));
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setListError(null);
    try {
      setItems(await apiGet<MenuItem[]>("/api/admin/menu"));
    } catch (e) {
      setListError(e instanceof ApiError ? e.message : "Не удалось загрузить меню");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
    apiGet<PageListItem[]>("/api/admin/pages")
      .then(setPages)
      .catch(() => setPages([]));
  }, [loadItems]);

  const visible = items.filter((i) => i.location === location);
  const roots = visible.filter((i) => i.parentId === null).sort(byOrder);
  const childrenOf = (id: string) => visible.filter((i) => i.parentId === id).sort(byOrder);

  function parentOptions(): MenuItem[] {
    const excluded = new Set<string>();
    if (form.id) {
      excluded.add(form.id);
      items.filter((i) => i.parentId === form.id).forEach((i) => excluded.add(i.id));
    }
    return items
      .filter((i) => i.location === form.location && i.parentId === null && !excluded.has(i.id))
      .sort(byOrder);
  }

  async function move(item: MenuItem, dir: -1 | 1) {
    const level = items
      .filter((i) => i.location === item.location && i.parentId === item.parentId)
      .sort(byOrder);
    const idx = level.findIndex((i) => i.id === item.id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= level.length) return;
    const orderedIds = level.map((i) => i.id);
    [orderedIds[idx], orderedIds[swapIdx]] = [orderedIds[swapIdx], orderedIds[idx]];
    try {
      await apiPut("/api/admin/menu/reorder", {
        location: item.location,
        parentId: item.parentId,
        orderedIds,
      });
      await loadItems();
    } catch (e) {
      setListError(e instanceof ApiError ? e.message : "Ошибка сортировки");
    }
  }

  async function remove(item: MenuItem) {
    const hasChildren = items.some((i) => i.parentId === item.id);
    const message = hasChildren
      ? `Удалить «${item.label}»? Все дочерние пункты будут удалены вместе с ним.`
      : `Удалить «${item.label}»?`;
    if (!window.confirm(message)) return;
    try {
      await apiDelete(`/api/admin/menu/${item.id}`);
      if (form.id === item.id) setForm(emptyForm(location));
      await loadItems();
    } catch (e) {
      setListError(e instanceof ApiError ? e.message : "Ошибка удаления");
    }
  }

  function startEdit(item: MenuItem) {
    setForm({
      id: item.id,
      label: item.label,
      location: item.location,
      parentId: item.parentId ?? "",
      linkMode: item.pageId ? "page" : "url",
      pageId: item.pageId ?? "",
      url: item.url ?? "",
    });
    setFormError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const label = form.label.trim();
    if (!label) {
      setFormError("Укажите название пункта");
      return;
    }
    if (form.linkMode === "page" && !form.pageId) {
      setFormError("Выберите страницу");
      return;
    }
    if (form.linkMode === "url" && !form.url.trim()) {
      setFormError("Укажите URL");
      return;
    }
    const body = {
      location: form.location,
      parentId: form.parentId || null,
      label,
      pageId: form.linkMode === "page" ? form.pageId : null,
      url: form.linkMode === "url" ? form.url.trim() : null,
    };
    setSaving(true);
    try {
      if (form.id) {
        await apiPut(`/api/admin/menu/${form.id}`, body);
      } else {
        await apiPost("/api/admin/menu", body);
      }
      setLocation(form.location);
      setForm(emptyForm(form.location));
      await loadItems();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  function renderRow(item: MenuItem, depth: number, index: number, levelSize: number) {
    const link = item.pageSlug ? item.pageSlug : item.url;
    return (
      <tr key={item.id}>
        <td style={depth > 0 ? { paddingLeft: "2rem" } : undefined}>
          {depth > 0 && <span className="admin-muted">└ </span>}
          {item.label}
        </td>
        <td className="admin-muted">{link ?? "—"}</td>
        <td>
          <div className="admin-row">
            <button
              className="admin-btn admin-btn--secondary admin-btn--small"
              disabled={index === 0}
              onClick={() => void move(item, -1)}
              title="Выше"
            >
              ↑
            </button>
            <button
              className="admin-btn admin-btn--secondary admin-btn--small"
              disabled={index === levelSize - 1}
              onClick={() => void move(item, 1)}
              title="Ниже"
            >
              ↓
            </button>
            <button className="admin-btn admin-btn--secondary admin-btn--small" onClick={() => startEdit(item)}>
              Править
            </button>
            <button className="admin-btn admin-btn--danger admin-btn--small" onClick={() => void remove(item)}>
              Удалить
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <h1>Меню</h1>
      <div className="admin-row" style={{ marginBottom: "1rem" }}>
        {(["HEADER", "FOOTER"] as Location[]).map((loc) => (
          <button
            key={loc}
            className={loc === location ? "admin-btn" : "admin-btn admin-btn--secondary"}
            onClick={() => {
              setLocation(loc);
              setForm(emptyForm(loc));
              setFormError(null);
            }}
          >
            {loc === "HEADER" ? "Шапка" : "Подвал"}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {listError && <p className="admin-error">{listError}</p>}
        {loading ? (
          <p className="admin-muted">Загрузка…</p>
        ) : roots.length === 0 ? (
          <p className="admin-muted">Пунктов пока нет — добавьте первый.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Пункт</th>
                <th>Ссылка</th>
                <th style={{ width: "17rem" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {roots.map((root, rIdx) => {
                const children = childrenOf(root.id);
                return (
                  <Fragment key={root.id}>
                    {renderRow(root, 0, rIdx, roots.length)}
                    {children.map((child, cIdx) => renderRow(child, 1, cIdx, children.length))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>{form.id ? "Редактировать пункт" : "Новый пункт"}</h2>
        <form onSubmit={onSubmit}>
          <label className="admin-field">
            <span>Название</span>
            <input
              className="admin-input"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </label>
          <label className="admin-field">
            <span>Область</span>
            <select
              className="admin-select"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value as Location, parentId: "" })
              }
            >
              <option value="HEADER">Шапка</option>
              <option value="FOOTER">Подвал</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Родительский пункт</span>
            <select
              className="admin-select"
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            >
              <option value="">— нет —</option>
              {parentOptions().map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-field">
            <span>Ссылка</span>
            <div className="admin-row">
              <label>
                <input
                  type="radio"
                  name="linkMode"
                  checked={form.linkMode === "page"}
                  onChange={() => setForm({ ...form, linkMode: "page" })}
                />{" "}
                Страница
              </label>
              <label>
                <input
                  type="radio"
                  name="linkMode"
                  checked={form.linkMode === "url"}
                  onChange={() => setForm({ ...form, linkMode: "url" })}
                />{" "}
                URL
              </label>
            </div>
          </div>
          {form.linkMode === "page" ? (
            <label className="admin-field">
              <span>Страница</span>
              <select
                className="admin-select"
                value={form.pageId}
                onChange={(e) => setForm({ ...form, pageId: e.target.value })}
              >
                <option value="">— выберите страницу —</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="admin-field">
              <span>URL</span>
              <input
                className="admin-input"
                placeholder="/contacts или https://…"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>
          )}
          {formError && <p className="admin-error">{formError}</p>}
          <div className="admin-row">
            <button className="admin-btn" type="submit" disabled={saving}>
              {saving ? "Сохранение…" : form.id ? "Сохранить" : "Создать"}
            </button>
            {form.id && (
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => {
                  setForm(emptyForm(location));
                  setFormError(null);
                }}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
