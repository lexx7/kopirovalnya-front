import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

interface Props {
  params: Promise<{ path: string[] }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { path } = await params;
  const res = await fetch(`${API_URL}/uploads/${path.map(encodeURIComponent).join("/")}`, {
    cache: "no-store",
  });
  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
