"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, apiDelete, apiGet, apiUpload } from "@/lib/admin/api";
import type { MediaDto } from "@/lib/admin/types";

export default function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setMedia(await apiGet<MediaDto[]>("/api/admin/media"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить медиатеку");
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await apiUpload<MediaDto>("/api/admin/media", file);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить файл");
    } finally {
      setUploading(false);
    }
  }

  async function onCopy(item: MediaDto) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId((cur) => (cur === item.id ? null : cur)), 1500);
    } catch {
      setError("Не удалось скопировать URL");
    }
  }

  async function onDelete(item: MediaDto) {
    if (!window.confirm(`Удалить файл «${item.filename}»?`)) return;
    setError(null);
    try {
      await apiDelete(`/api/admin/media/${item.id}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось удалить файл");
    }
  }

  return (
    <>
      <h1>Медиатека</h1>

      <div className="admin-card">
        <form className="admin-row" onSubmit={onUpload}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={uploading}
          />
          <button className="admin-btn" type="submit" disabled={!file || uploading}>
            {uploading ? "Загрузка…" : "Загрузить"}
          </button>
        </form>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading ? (
        <p className="admin-muted">Загрузка…</p>
      ) : media.length === 0 ? (
        <p className="admin-muted">Файлов пока нет</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {media.map((m) => (
            <div className="admin-card" key={m.id} style={{ marginBottom: 0 }}>
              <a href={m.url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.filename}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    display: "block",
                  }}
                />
              </a>
              <div style={{ margin: "0.5rem 0", wordBreak: "break-all" }}>{m.filename}</div>
              <div className="admin-muted" style={{ marginBottom: "0.5rem" }}>
                {(m.size / 1024).toFixed(1)} КБ
              </div>
              <div className="admin-row">
                <button
                  className="admin-btn admin-btn--secondary admin-btn--small"
                  type="button"
                  onClick={() => void onCopy(m)}
                >
                  {copiedId === m.id ? "Скопировано" : "Копировать URL"}
                </button>
                <button
                  className="admin-btn admin-btn--danger admin-btn--small"
                  type="button"
                  onClick={() => void onDelete(m)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
