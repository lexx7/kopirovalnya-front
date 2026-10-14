export type Role = "ADMIN" | "EDITOR";

export interface UserDto {
  id: string;
  username: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: UserDto;
}

export interface PageBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  sortOrder: number;
}

export interface PageListItem {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface PageDto extends PageListItem {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  blocks: PageBlock[];
  createdAt: string;
}

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

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface ProductDto {
  id: string;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  images: string[];
  published: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "NEW" | "IN_PROGRESS" | "DONE";
export type LeadType = "CALLBACK" | "ORDER";

export interface LeadDto {
  id: string;
  type: LeadType;
  name: string | null;
  phone: string;
  comment: string | null;
  productId: string | null;
  productSlug: string | null;
  productName: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface MediaDto {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  createdAt: string;
}
