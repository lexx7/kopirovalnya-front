"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost, apiPut, ApiError } from "@/lib/admin/api";
import { nextKey } from "@/lib/admin/id";
import type { PageDto } from "@/lib/admin/types";

const BLOCK_TYPES = [
  { value: "hero", label: "Hero (главный экран)" },
  { value: "hero-alt", label: "Hero (альтернативный)" },
  { value: "stylistics", label: "Стилистика" },
  { value: "possibilities", label: "Возможности" },
  { value: "materials", label: "Материалы" },
  { value: "materials-alt", label: "Материалы (альтернативные)" },
  { value: "process", label: "Процесс" },
  { value: "process-main", label: "Процесс (на главной)" },
  { value: "time", label: "Сроки" },
  { value: "price-table", label: "Таблица цен" },
  { value: "slider", label: "Слайдер" },
  { value: "reviews", label: "Отзывы" },
  { value: "technologies", label: "Технологии" },
];

const SLUG_PATTERN = /^\/[a-zA-Z0-9_\-/]*$/;

interface BlockState {
  key: string;
  type: string;
  contentText: string;
}

interface FormState {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  published: boolean;
  sortOrder: string;
  blocks: BlockState[];
}

function initState(initial?: PageDto): FormState {
  if (!initial) {
    return {
      slug: "/",
      title: "",
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      published: false,
      sortOrder: "0",
      blocks: [],
    };
  }
  return {
    slug: initial.slug,
    title: initial.title,
    metaTitle: initial.metaTitle ?? "",
    metaDescription: initial.metaDescription ?? "",
    ogImage: initial.ogImage ?? "",
    published: initial.published,
    sortOrder: String(initial.sortOrder),
    blocks: [...initial.blocks]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => ({
        key: nextKey(),
        type: b.type,
        contentText: JSON.stringify(b.content, null, 2),
      })),
  };
}

export default function PageForm({ initial }: { initial?: PageDto }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initState(initial));
  const [newBlockType, setNewBlockType] = useState<string>(BLOCK_TYPES[0].value);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function patchForm(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function updateBlock(key: string, patch: Partial<BlockState>) {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.key === key ? { ...b, ...patch } : b)),
    }));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.blocks.length) return prev;
      const blocks = [...prev.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...prev, blocks };
    });
  }

  function removeBlock(key: string) {
    setForm((prev) => ({ ...prev, blocks: prev.blocks.filter((b) => b.key !== key) }));
  }

  function addBlock() {
    setForm((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { key: nextKey(), type: newBlockType, contentText: "{}" }],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const slug = form.slug.trim();
    if (!SLUG_PATTERN.test(slug)) {
      setError('Slug должен начинаться с "/" и содержать только латиницу, цифры, "-", "_"');
      return;
    }

    const sortOrder = Number(form.sortOrder);
    if (!Number.isInteger(sortOrder)) {
      setError("Порядок сортировки должен быть целым числом");
      return;
    }

    const blocks: Array<{ type: string; content: Record<string, unknown>; sortOrder: number }> = [];
    for (let i = 0; i < form.blocks.length; i++) {
      const b = form.blocks[i];
      let content: unknown;
      try {
        content = JSON.parse(b.contentText);
      } catch {
        setError(`Блок №${i + 1} (${b.type}): некорректный JSON`);
        return;
      }
      if (typeof content !== "object" || content === null || Array.isArray(content)) {
        setError(`Блок №${i + 1} (${b.type}): content должен быть JSON-объектом`);
        return;
      }
      blocks.push({ type: b.type, content: content as Record<string, unknown>, sortOrder: i });
    }

    const body = {
      slug,
      title: form.title.trim(),
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
      ogImage: form.ogImage.trim() || null,
      published: form.published,
      sortOrder,
      blocks,
    };

    setPending(true);
    try {
      if (initial) {
        await apiPut<PageDto>(`/api/admin/pages/${initial.id}`, body);
      } else {
        await apiPost<PageDto>("/api/admin/pages", body);
      }
      router.push("/admin/pages");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка сохранения");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card">
        <label className="admin-field">
          <span>Slug *</span>
          <input
            className="admin-input"
            value={form.slug}
            onChange={(e) => patchForm({ slug: e.target.value })}
            required
          />
          <small className="admin-muted">
            Начинается с &quot;/&quot;, только латиница, цифры, &quot;-&quot;, &quot;_&quot;. Например: / или /about
          </small>
        </label>
        <label className="admin-field">
          <span>Заголовок *</span>
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => patchForm({ title: e.target.value })}
            required
          />
        </label>
        <label className="admin-field">
          <span>Meta title</span>
          <input
            className="admin-input"
            value={form.metaTitle}
            onChange={(e) => patchForm({ metaTitle: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Meta description</span>
          <textarea
            className="admin-textarea"
            value={form.metaDescription}
            onChange={(e) => patchForm({ metaDescription: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>OG image (URL картинки)</span>
          <input
            className="admin-input"
            value={form.ogImage}
            onChange={(e) => patchForm({ ogImage: e.target.value })}
            placeholder="https://…"
          />
        </label>
        <div className="admin-row">
          <label className="admin-field" style={{ marginBottom: 0 }}>
            <span>Порядок сортировки</span>
            <input
              className="admin-input"
              type="number"
              style={{ width: "8rem" }}
              value={form.sortOrder}
              onChange={(e) => patchForm({ sortOrder: e.target.value })}
              required
            />
          </label>
          <label className="admin-row" style={{ gap: "0.4rem" }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => patchForm({ published: e.target.checked })}
            />
            Опубликована
          </label>
        </div>
      </div>

      <h2>Блоки</h2>
      {form.blocks.length === 0 && <p className="admin-muted">Блоков пока нет</p>}
      {form.blocks.map((b, i) => (
        <div className="admin-card" key={b.key}>
          <div className="admin-row" style={{ marginBottom: "0.5rem" }}>
            <strong>#{i + 1}</strong>
            <select
              className="admin-select"
              style={{ width: "auto" }}
              value={b.type}
              onChange={(e) => updateBlock(b.key, { type: e.target.value })}
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <span style={{ flex: 1 }} />
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--small"
              onClick={() => moveBlock(i, -1)}
              disabled={i === 0}
              title="Выше"
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--small"
              onClick={() => moveBlock(i, 1)}
              disabled={i === form.blocks.length - 1}
              title="Ниже"
            >
              ↓
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeBlock(b.key)}
            >
              Удалить
            </button>
          </div>
          <textarea
            className="admin-textarea admin-textarea--code"
            value={b.contentText}
            onChange={(e) => updateBlock(b.key, { contentText: e.target.value })}
            spellCheck={false}
          />
        </div>
      ))}

      <div className="admin-card">
        <div className="admin-row">
          <select
            className="admin-select"
            style={{ width: "auto" }}
            value={newBlockType}
            onChange={(e) => setNewBlockType(e.target.value)}
          >
            {BLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addBlock}>
            + Добавить блок
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? "Сохранение…" : initial ? "Сохранить" : "Создать"}
      </button>
    </form>
  );
}
