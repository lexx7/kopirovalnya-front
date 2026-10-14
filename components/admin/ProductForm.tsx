"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ApiError, apiGet, apiPost, apiPut, apiUpload } from "@/lib/admin/api";
import type { CategoryDto, MediaDto, ProductDto } from "@/lib/admin/types";

interface ProductFormProps {
  initial?: ProductDto;
}

export default function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<CategoryDto[]>("/api/admin/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function setImage(index: number, value: string) {
    setImages((prev) => prev.map((u, i) => (i === index ? value : u)));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const media = await apiUpload<MediaDto>("/api/admin/media", file);
      setImages((prev) => [...prev, media.url]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить файл");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      categoryId: categoryId || null,
      slug: slug.trim(),
      name: name.trim(),
      description: description.trim() || null,
      price: price.trim() === "" ? null : Number(price),
      images: images.map((u) => u.trim()).filter(Boolean),
      published,
      sortOrder: Number(sortOrder) || 0,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
    };
    try {
      if (initial) {
        await apiPut(`/api/admin/products/${initial.id}`, body);
      } else {
        await apiPost("/api/admin/products", body);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "Товар с таким slug уже существует"
          : err instanceof ApiError
            ? err.message
            : "Не удалось сохранить товар",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card">
        <div className="admin-row">
          <label className="admin-field" style={{ flex: 1, minWidth: 220 }}>
            <span>Рубрика</span>
            <select
              className="admin-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— без рубрики —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field" style={{ flex: 1, minWidth: 220 }}>
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
        </div>

        <label className="admin-field">
          <span>Название</span>
          <input
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>Описание</span>
          <textarea
            className="admin-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="admin-row">
          <label className="admin-field" style={{ width: 180 }}>
            <span>Цена</span>
            <input
              className="admin-input"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="—"
            />
          </label>
          <label className="admin-field" style={{ width: 140 }}>
            <span>Сортировка</span>
            <input
              className="admin-input"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </label>
          <label
            className="admin-field admin-row"
            style={{ gap: "0.4rem", marginTop: "1.4rem" }}
          >
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span style={{ margin: 0 }}>Опубликован</span>
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Изображения</h2>
        {images.map((url, i) => (
          <div className="admin-row" key={i} style={{ marginBottom: "0.5rem" }}>
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt=""
                width={80}
                height={80}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "0.5rem" }}
              />
            )}
            <input
              className="admin-input"
              style={{ flex: 1, minWidth: 220 }}
              value={url}
              onChange={(e) => setImage(i, e.target.value)}
              placeholder="/uploads/…"
            />
            <button
              className="admin-btn admin-btn--danger admin-btn--small"
              type="button"
              onClick={() => removeImage(i)}
            >
              Удалить
            </button>
          </div>
        ))}
        <div className="admin-row">
          <button
            className="admin-btn admin-btn--secondary admin-btn--small"
            type="button"
            onClick={() => setImages((prev) => [...prev, ""])}
          >
            Добавить URL
          </button>
          <span className="admin-muted">или</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void onFileChange(e)}
            disabled={uploading}
          />
          {uploading && <span className="admin-muted">Загрузка…</span>}
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0, fontSize: "1rem" }}>SEO</h2>
        <label className="admin-field">
          <span>Meta title</span>
          <input
            className="admin-input"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </label>
        <label className="admin-field" style={{ marginBottom: 0 }}>
          <span>Meta description</span>
          <textarea
            className="admin-textarea"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}
      <div className="admin-row">
        <button className="admin-btn" type="submit" disabled={saving || uploading}>
          {saving ? "Сохранение…" : initial ? "Сохранить" : "Создать товар"}
        </button>
        <button
          className="admin-btn admin-btn--secondary"
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={saving}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
