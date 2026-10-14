import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import styles from "./catalog.module.css";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Товары и услуги фотосалона Копировальня",
};

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <>
      <PageHeader />
      <main className={`main container-narrow ${styles.catalog}`}>
        <h1 className={styles.title}>Каталог</h1>
        <ul className={styles.filters}>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link className={styles.filterLink} href={`/catalog/${c.slug}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        {products.length === 0 ? (
          <p className={styles.empty}>Товары скоро появятся</p>
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
