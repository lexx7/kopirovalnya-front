"use client";

import { openCallbackModal } from "@/lib/cta";

export default function OrderButton({
  productSlug,
  productName,
  className,
}: {
  productSlug: string;
  productName: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openCallbackModal({ productSlug, productName })}
    >
      Оформить заказ
    </button>
  );
}
