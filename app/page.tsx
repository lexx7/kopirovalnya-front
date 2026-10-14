import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getPage } from "@/lib/api";
import PageShell from "@/components/PageShell";
import { defaultHomeBlocks } from "@/components/BlockRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/").catch(() => null);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
    openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
  };
}

export default async function HomePage() {
  const page = await getPage("/").catch(() => null);
  return <PageShell blocks={page?.blocks ?? defaultHomeBlocks} />;
}
