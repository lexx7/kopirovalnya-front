"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/admin/auth";
import { ApiError } from "@/lib/admin/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(username, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка входа");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Вход в админку</h1>
        <form onSubmit={onSubmit}>
          <label className="admin-field">
            <span>Логин</span>
            <input
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="admin-field">
            <span>Пароль</span>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn" type="submit" disabled={pending} style={{ width: "100%" }}>
            {pending ? "Вход…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
