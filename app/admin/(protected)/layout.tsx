"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/admin/auth";

const NAV_ITEMS = [
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/menu", label: "Меню" },
  { href: "/admin/layout", label: "Header / Footer" },
  { href: "/admin/categories", label: "Рубрики" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/media", label: "Медиа" },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="admin-content">Загрузка…</div>;
  }

  return (
    <>
      <nav className="admin-nav">
        <Link href="/admin" className="brand">
          Копировальня CMS
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={pathname.startsWith(item.href) ? { color: "#fff", fontWeight: 600 } : undefined}
          >
            {item.label}
          </Link>
        ))}
        {user.role === "ADMIN" && <Link href="/admin/users">Пользователи</Link>}
        <span className="spacer" />
        <a href="/" target="_blank" rel="noreferrer">
          Открыть сайт ↗
        </a>
        <span className="admin-muted" style={{ color: "#a8a29e" }}>
          {user.username} ({user.role})
        </span>
        <button className="admin-btn admin-btn--secondary admin-btn--small" onClick={() => void logout()}>
          Выйти
        </button>
      </nav>
      <div className="admin-content">{children}</div>
    </>
  );
}
