import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ApiError, getPage } from "@/lib/api";
import PageShell from "@/components/PageShell";

interface Props {
  params: Promise<{ slug: string[] }>;
}

async function loadPage(slug: string[]) {
  const page = await getPage(`/${slug.join("/")}`).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await loadPage((await params).slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
    openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const page = await loadPage((await params).slug);
  if (!page) notFound();
  return <PageShell blocks={page.blocks} />;
}
