"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut, ApiError } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import type { Role, UserDto } from "@/lib/admin/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("EDITOR");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editing, setEditing] = useState<UserDto | null>(null);
  const [editRole, setEditRole] = useState<Role>("EDITOR");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setUsers(await apiGet<UserDto[]>("/api/admin/users"));
    } catch (err) {
      setError(errorMessage(err, "Не удалось загрузить пользователей"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const isSelf = (u: UserDto) => currentUser?.id === u.id;

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await apiPost<UserDto>("/api/admin/users", {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
      setNewUsername("");
      setNewPassword("");
      setNewRole("EDITOR");
      await load();
    } catch (err) {
      setCreateError(
        err instanceof ApiError && err.status === 409
          ? "Пользователь с таким именем уже существует"
          : errorMessage(err, "Не удалось создать пользователя"),
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(u: UserDto) {
    setEditing(u);
    setEditRole(u.role);
    setEditEnabled(u.enabled);
    setEditPassword("");
    setEditError(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setEditError(null);
    try {
      await apiPut<UserDto>(`/api/admin/users/${editing.id}`, {
        role: editRole,
        enabled: editEnabled,
        ...(editPassword ? { password: editPassword } : {}),
      });
      setEditing(null);
      await load();
    } catch (err) {
      setEditError(errorMessage(err, "Не удалось сохранить изменения"));
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(u: UserDto) {
    if (!window.confirm(`Удалить пользователя «${u.username}»?`)) return;
    setError(null);
    try {
      await apiDelete(`/api/admin/users/${u.id}`);
      if (editing?.id === u.id) setEditing(null);
      await load();
    } catch (err) {
      setError(errorMessage(err, "Не удалось удалить пользователя"));
    }
  }

  return (
    <>
      <h1>Пользователи</h1>

      <div className="admin-card">
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p className="admin-muted">Загрузка…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Создан</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.username}
                    {isSelf(u) && <span className="admin-muted"> (это вы)</span>}
                  </td>
                  <td>
                    <span className={`admin-badge${u.role === "ADMIN" ? " admin-badge--yellow" : ""}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge${u.enabled ? " admin-badge--green" : ""}`}>
                      {u.enabled ? "Вкл" : "Откл"}
                    </span>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="admin-row">
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--small"
                        onClick={() => startEdit(u)}
                      >
                        Править
                      </button>
                      {!isSelf(u) && (
                        <button
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => void removeUser(u)}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="admin-card">
          <h2 style={{ marginTop: 0 }}>Редактирование: {editing.username}</h2>
          <form onSubmit={(e) => void saveEdit(e)}>
            <label className="admin-field">
              <span>Роль</span>
              <select
                className="admin-select"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as Role)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="EDITOR">EDITOR</option>
              </select>
            </label>
            {!isSelf(editing) && (
              <label className="admin-field admin-row">
                <input
                  type="checkbox"
                  checked={editEnabled}
                  onChange={(e) => setEditEnabled(e.target.checked)}
                />
                <span style={{ margin: 0 }}>Учётная запись включена</span>
              </label>
            )}
            <label className="admin-field">
              <span>Новый пароль (пусто — не менять)</span>
              <input
                className="admin-input"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
              />
            </label>
            {editError && <p className="admin-error">{editError}</p>}
            <div className="admin-row">
              <button className="admin-btn" type="submit" disabled={saving}>
                Сохранить
              </button>
              <button
                className="admin-btn admin-btn--secondary"
                type="button"
                onClick={() => setEditing(null)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Новый пользователь</h2>
        <form onSubmit={(e) => void createUser(e)}>
          <label className="admin-field">
            <span>Имя пользователя</span>
            <input
              className="admin-input"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              minLength={3}
              maxLength={64}
              autoComplete="off"
              required
            />
          </label>
          <label className="admin-field">
            <span>Пароль</span>
            <input
              className="admin-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="admin-field">
            <span>Роль</span>
            <select
              className="admin-select"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
            >
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          {createError && <p className="admin-error">{createError}</p>}
          <button className="admin-btn" type="submit" disabled={creating}>
            {creating ? "Создание…" : "Создать"}
          </button>
        </form>
      </div>
    </>
  );
}
