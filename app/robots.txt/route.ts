import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function GET() {
  const res = await fetch(`${API_URL}/api/public/robots.txt`, { cache: "no-store" });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
