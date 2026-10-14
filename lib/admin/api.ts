"use client";

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorized = callback;
}

async function doRefresh(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) return false;
    const data = await response.json();
    accessToken = data.accessToken;
    return true;
  } catch {
    return false;
  }
}

function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const doFetch = () =>
    fetch(url, {
      method,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await doFetch();

  if (response.status === 401 && !url.startsWith("/api/auth/")) {
    if (await tryRefresh()) {
      response = await doFetch();
    } else {
      accessToken = null;
      onUnauthorized?.();
      throw new ApiError(401, "Сессия истекла");
    }
  }

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    let message = `Ошибка запроса (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data?.message === "string") message = data.message;
    } catch {
      // тело ответа не JSON — оставляем сообщение по умолчанию
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export const apiGet = <T>(url: string): Promise<T> => request<T>("GET", url);
export const apiPost = <T>(url: string, body?: unknown): Promise<T> => request<T>("POST", url, body);
export const apiPut = <T>(url: string, body?: unknown): Promise<T> => request<T>("PUT", url, body);
export const apiPatch = <T>(url: string, body?: unknown): Promise<T> => request<T>("PATCH", url, body);
export const apiDelete = <T>(url: string): Promise<T> => request<T>("DELETE", url);

export async function apiUpload<T>(url: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  const doFetch = () =>
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: formData,
    });
  let response = await doFetch();
  if (response.status === 401 && (await tryRefresh())) {
    response = await doFetch();
  }
  if (!response.ok) throw new ApiError(response.status, `Ошибка загрузки (${response.status})`);
  return response.json() as Promise<T>;
}
