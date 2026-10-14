"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut, ApiError } from "@/lib/admin/api";

const SOCIAL_TYPES = ["whatsapp", "vk", "telegram", "mail"] as const;
type SocialType = (typeof SOCIAL_TYPES)[number];

interface SocialEntry {
  type: SocialType;
  url: string;
}

interface Fields {
  city: string;
  phone: string;
  callbackLabel: string;
  copyright: string;
}

const EMPTY_FIELDS: Fields = { city: "", phone: "", callbackLabel: "", copyright: "" };

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseSocials(value: unknown): SocialEntry[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return null;
  const result: SocialEntry[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const { type, url } = entry as { type?: unknown; url?: unknown };
    if (typeof type !== "string" || !(SOCIAL_TYPES as readonly string[]).includes(type)) return null;
    if (typeof url !== "string") return null;
    result.push({ type: type as SocialType, url });
  }
  return result;
}

function splitObject(obj: Record<string, unknown>) {
  const { city, phone, callbackLabel, copyright, socials, ...extras } = obj;
  return {
    fields: {
      city: readString(city),
      phone: readString(phone),
      callbackLabel: readString(callbackLabel),
      copyright: readString(copyright),
    },
    socials: parseSocials(socials) ?? [],
    extras,
  };
}

function LayoutEditor({
  title,
  endpoint,
  variant,
}: {
  title: string;
  endpoint: string;
  variant: "header" | "footer";
}) {
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [socials, setSocials] = useState<SocialEntry[]>([]);
  const [extras, setExtras] = useState<Record<string, unknown>>({});
  const [jsonText, setJsonText] = useState("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<Record<string, unknown>>(endpoint)
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          const parsed = splitObject(data);
          setFields(parsed.fields);
          setSocials(parsed.socials);
          setExtras(parsed.extras);
          setJsonText(JSON.stringify(data, null, 2));
        }
      })
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Не удалось загрузить настройки"),
      );
  }, [endpoint]);

  const updateFields = (patch: Partial<Fields>) => {
    setSaved(false);
    setFields((f) => ({ ...f, ...patch }));
  };

  const updateSocial = (idx: number, entry: SocialEntry) => {
    setSaved(false);
    setSocials((list) => list.map((s, i) => (i === idx ? entry : s)));
  };

  function applyJson() {
    setJsonError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError("Невалидный JSON");
      return;
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      setJsonError("JSON должен быть объектом");
      return;
    }
    const obj = parsed as Record<string, unknown>;
    if (parseSocials(obj.socials) === null) {
      setJsonError("socials должен быть массивом { type: whatsapp | vk | telegram | mail, url: string }");
      return;
    }
    const parts = splitObject(obj);
    setFields(parts.fields);
    setSocials(parts.socials);
    setExtras(parts.extras);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const cleanSocials = socials
      .filter((s) => s.url.trim() !== "")
      .map((s) => ({ type: s.type, url: s.url.trim() }));
    const body: Record<string, unknown> =
      variant === "header"
        ? {
            ...extras,
            city: fields.city,
            phone: fields.phone,
            callbackLabel: fields.callbackLabel,
            socials: cleanSocials,
          }
        : { ...extras, copyright: fields.copyright, phone: fields.phone, socials: cleanSocials };
    try {
      await apiPut(endpoint, body);
      setSocials(cleanSocials);
      setJsonText(JSON.stringify(body, null, 2));
      setSaved(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {variant === "header" ? (
        <label className="admin-field">
          <span>Город</span>
          <input
            className="admin-input"
            value={fields.city}
            onChange={(e) => updateFields({ city: e.target.value })}
          />
        </label>
      ) : (
        <label className="admin-field">
          <span>Копирайт</span>
          <input
            className="admin-input"
            value={fields.copyright}
            onChange={(e) => updateFields({ copyright: e.target.value })}
          />
        </label>
      )}
      <label className="admin-field">
        <span>Телефон</span>
        <input
          className="admin-input"
          value={fields.phone}
          onChange={(e) => updateFields({ phone: e.target.value })}
        />
      </label>
      {variant === "header" && (
        <label className="admin-field">
          <span>Текст кнопки обратного звонка</span>
          <input
            className="admin-input"
            value={fields.callbackLabel}
            onChange={(e) => updateFields({ callbackLabel: e.target.value })}
          />
        </label>
      )}

      <div className="admin-field">
        <span>Соцсети</span>
        {socials.map((s, idx) => (
          <div className="admin-row" key={idx} style={{ marginBottom: "0.4rem" }}>
            <select
              className="admin-select"
              style={{ width: "auto" }}
              value={s.type}
              onChange={(e) => updateSocial(idx, { ...s, type: e.target.value as SocialType })}
            >
              {SOCIAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              className="admin-input"
              style={{ flex: 1 }}
              placeholder="https://…"
              value={s.url}
              onChange={(e) => updateSocial(idx, { ...s, url: e.target.value })}
            />
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => {
                setSaved(false);
                setSocials((list) => list.filter((_, i) => i !== idx));
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-btn--small"
          onClick={() => setSocials((list) => [...list, { type: "whatsapp", url: "" }])}
        >
          + Добавить соцсеть
        </button>
      </div>

      <div className="admin-field">
        <span>Расширенный JSON</span>
        <textarea
          className="admin-textarea admin-textarea--code"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
        />
      </div>
      {jsonError && <p className="admin-error">{jsonError}</p>}
      <div className="admin-row">
        <button type="button" className="admin-btn admin-btn--secondary" onClick={applyJson}>
          Применить JSON
        </button>
      </div>

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button type="button" className="admin-btn" disabled={saving} onClick={() => void save()}>
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
        {saved && <span className="admin-badge admin-badge--green">Сохранено</span>}
      </div>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

export default function LayoutPage() {
  return (
    <>
      <h1>Header / Footer</h1>
      <LayoutEditor title="Шапка" endpoint="/api/admin/layout/header" variant="header" />
      <LayoutEditor title="Подвал" endpoint="/api/admin/layout/footer" variant="footer" />
    </>
  );
}
