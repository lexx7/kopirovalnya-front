"use client";

import Link from "next/link";
import PageForm from "@/components/admin/PageForm";

export default function NewPagePage() {
  return (
    <>
      <p>
        <Link href="/admin/pages">← К списку страниц</Link>
      </p>
      <h1>Новая страница</h1>
      <PageForm />
    </>
  );
}
