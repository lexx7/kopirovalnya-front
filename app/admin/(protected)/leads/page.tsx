"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch, ApiError } from "@/lib/admin/api";
import type { LeadDto, LeadStatus } from "@/lib/admin/types";

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  DONE: "Завершена",
};

const FILTERS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "Все" },
  { value: "NEW", label: "Новые" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "DONE", label: "Завершены" },
];

function statusBadgeClass(status: LeadStatus): string {
  if (status === "NEW") return "admin-badge--yellow";
  if (status === "DONE") return "admin-badge--green";
  return "";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(text: string, max = 80): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadDto[]>([]);
  const [filter, setFilter] = useState<LeadStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = filter ? `/api/admin/leads?status=${filter}` : "/api/admin/leads";
    apiGet<LeadDto[]>(url)
      .then((data) => {
        if (!cancelled) setLeads(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Не удалось загрузить заявки");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function changeStatus(lead: LeadDto, status: LeadStatus) {
    setUpdatingId(lead.id);
    setError(null);
    try {
      const updated = await apiPatch<LeadDto>(`/api/admin/leads/${lead.id}`, { status });
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось обновить статус");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <h1>Заявки</h1>
      <div className="admin-card">
        <div className="admin-row" style={{ marginBottom: "1rem" }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`admin-btn admin-btn--small${filter === f.value ? "" : " admin-btn--secondary"}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p className="admin-muted">Загрузка…</p>
        ) : leads.length === 0 ? (
          <p className="admin-muted">Заявок нет</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Товар</th>
                <th>Комментарий</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>{lead.type === "CALLBACK" ? "Звонок" : "Заказ"}</td>
                  <td>{lead.name || "—"}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.productName || "—"}</td>
                  <td>{lead.comment ? truncate(lead.comment) : "—"}</td>
                  <td>
                    <select
                      className={`admin-badge ${statusBadgeClass(lead.status)}`}
                      style={{ border: "none", cursor: "pointer" }}
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => void changeStatus(lead, e.target.value as LeadStatus)}
                    >
                      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
