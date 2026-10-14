import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getCategories, getProducts } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import styles from "../catalog.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return { title: category.name };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader />
      <main className={`main container-narrow ${styles.catalog}`}>
        <h1 className={styles.title}>{category.name}</h1>
        <ul className={styles.filters}>
          <li>
            <Link className={styles.filterLink} href="/catalog">
              Все товары
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                className={c.slug === slug ? styles.filterLinkActive : styles.filterLink}
                href={`/catalog/${c.slug}`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        {products.length === 0 ? (
          <p className={styles.empty}>В этой рубрике пока нет товаров</p>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <Link key={p.slug} className={styles.card} href={`/product/${p.slug}`}>
                {p.images[0] && <img className={styles.cardImage} src={p.images[0]} alt={p.name} loading="lazy" />}
                <div className={styles.cardBody}>
                  <p className={styles.cardName}>{p.name}</p>
                  {p.price != null && <p className={styles.cardPrice}>{p.price} ₽</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
