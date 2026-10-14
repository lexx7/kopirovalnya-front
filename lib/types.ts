export type Role = "ADMIN" | "EDITOR";

export interface MenuItem {
  id: string;
  location: "HEADER" | "FOOTER";
  parentId: string | null;
  label: string;
  pageId: string | null;
  pageSlug: string | null;
  url: string | null;
  sortOrder: number;
}

export interface PublicLayout {
  header: Record<string, unknown>;
  footer: Record<string, unknown>;
  menu: Record<string, MenuItem[]>;
}

export interface PageBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  sortOrder: number;
}

export interface PublicPage {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  blocks: PageBlock[];
}

export interface PublicPageListItem {
  slug: string;
  title: string;
}

export interface PublicCategory {
  slug: string;
  name: string;
}

export interface PublicProduct {
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  images: string[];
  categorySlug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export type LeadType = "CALLBACK" | "ORDER";
