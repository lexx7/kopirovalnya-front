"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet, ApiError } from "@/lib/admin/api";
import type { PageDto } from "@/lib/admin/types";
import PageForm from "@/components/admin/PageForm";

export default function EditPagePage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<PageDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<PageDto>(`/api/admin/pages/${id}`)
      .then(setPage)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Ошибка загрузки")
      );
  }, [id]);

  if (error) {
    return (
      <>
        <p>
          <Link href="/admin/pages">← К списку страниц</Link>
        </p>
        <p className="admin-error">{error}</p>
      </>
    );
  }

  if (!page) return <p>Загрузка…</p>;

  return (
    <>
      <p>
        <Link href="/admin/pages">← К списку страниц</Link>
      </p>
      <h1>Редактирование: {page.title}</h1>
      <PageForm initial={page} />
    </>
  );
}
