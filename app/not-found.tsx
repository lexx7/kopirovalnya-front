import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader />
      <main className="main container-narrow" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h1>Страница не найдена</h1>
        <p>
          <Link href="/">Вернуться на главную</Link>
        </p>
      </main>
    </>
  );
}
