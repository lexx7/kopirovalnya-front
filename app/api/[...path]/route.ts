import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

interface Props {
  params: Promise<{ path: string[] }>;
}

/**
 * Универсальный прокси /api/<path> → backend /api/<path>.
 * Нужен, чтобы refresh-cookie (Path=/api/auth) работала same-origin.
 */
async function proxy(request: NextRequest, { params }: Props) {
  const { path } = await params;
  const url = `${API_URL}/api/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const res = await fetch(url, {
    method: request.method,
    headers,
    ...(hasBody ? { body: request.body, duplex: "half" as const } : {}),
  });

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (["content-encoding", "transfer-encoding", "connection"].includes(lower)) return;
    responseHeaders.append(key, value);
  });

  return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
