import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return new NextResponse(null, { status: 400 });

  const res = await fetch(`${API_URL}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new NextResponse(null, { status: res.status });
}
