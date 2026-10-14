"use client";

import { useEffect, useState } from "react";
import { CALLBACK_EVENT } from "@/lib/cta";
import styles from "./CallbackModal.module.css";

interface OrderDetails {
  productSlug?: string;
  productName?: string;
}

type FormStatus = "idle" | "sending" | "success" | "error";

export default function CallbackModal() {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      setOrder((e as CustomEvent<OrderDetails>).detail ?? null);
      setStatus("idle");
      setFormKey((k) => k + 1);
      setOpen(true);
    };
    window.addEventListener(CALLBACK_EVENT, handler);
    return () => window.removeEventListener(CALLBACK_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("is-lock");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-lock");
    };
  }, [open]);

  if (!open) return null;

  const isOrder = Boolean(order?.productSlug);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isOrder ? "ORDER" : "CALLBACK",
          name: (data.get("name") as string) || null,
          phone: data.get("phone"),
          comment: (data.get("comment") as string) || null,
          productSlug: order?.productSlug ?? null,
          website: data.get("website") || null,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" aria-label="Закрыть" onClick={() => setOpen(false)} />
        {status === "success" ? (
          <>
            <h2 className={styles.title}>Заявка отправлена</h2>
            <p className={styles.success}>Мы свяжемся с вами в ближайшее время.</p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>{isOrder ? "Оформить заказ" : "Заказать звонок"}</h2>
            <p className={styles.subtitle}>
              {isOrder && order?.productName ? `Товар: ${order.productName}` : "Оставьте телефон — мы перезвоним"}
            </p>
            <form key={formKey} onSubmit={onSubmit}>
              <label className={styles.field}>
                <input className={styles.input} name="name" placeholder="Ваше имя" autoComplete="name" />
              </label>
              <label className={styles.field}>
                <input
                  className={styles.input}
                  name="phone"
                  type="tel"
                  required
                  placeholder="Телефон *"
                  autoComplete="tel"
                />
              </label>
              <label className={styles.field}>
                <textarea className={styles.textarea} name="comment" placeholder="Комментарий" />
              </label>
              <label className={styles.honeypot} aria-hidden="true">
                Веб-сайт
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <button className={styles.submit} type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Отправка…" : "Отправить"}
              </button>
              {status === "error" && (
                <p className={styles.error}>Не удалось отправить. Позвоните нам, пожалуйста.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
