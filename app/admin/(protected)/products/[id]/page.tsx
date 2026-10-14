"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { ApiError, apiGet } from "@/lib/admin/api";
import type { ProductDto } from "@/lib/admin/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<ProductDto>(`/api/admin/products/${id}`)
      .then(setProduct)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Не удалось загрузить товар"),
      );
  }, [id]);

  if (error) {
    return (
      <>
        <h1>Редактирование товара</h1>
        <p className="admin-error">{error}</p>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <h1>Редактирование товара</h1>
        <p className="admin-muted">Загрузка…</p>
      </>
    );
  }

  return (
    <>
      <h1>Редактирование товара</h1>
      <ProductForm initial={product} />
    </>
  );
}
