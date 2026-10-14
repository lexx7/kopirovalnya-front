"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const sections = [
    { href: "/admin/pages", title: "Страницы", text: "Контент страниц, блоки, SEO" },
    { href: "/admin/menu", title: "Меню", text: "Пункты меню шапки и подвала" },
    { href: "/admin/layout", title: "Header / Footer", text: "Контакты, соцсети, копирайт" },
    { href: "/admin/categories", title: "Рубрики", text: "Категории каталога" },
    { href: "/admin/products", title: "Товары", text: "Каталог товаров и услуг" },
    { href: "/admin/leads", title: "Заявки", text: "Обращения с форм сайта" },
    { href: "/admin/media", title: "Медиа", text: "Загрузка изображений" },
    { href: "/admin/users", title: "Пользователи", text: "Учётные записи и роли" },
  ];
  return (
    <>
      <h1>Панель управления</h1>
      {sections.map((s) => (
        <div key={s.href} className="admin-card">
          <Link href={s.href}>
            <strong>{s.title}</strong>
          </Link>
          <p className="admin-muted" style={{ margin: "0.25rem 0 0" }}>
            {s.text}
          </p>
        </div>
      ))}
    </>
  );
}
