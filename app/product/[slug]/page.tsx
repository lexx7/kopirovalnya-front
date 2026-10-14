import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getProduct } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import OrderButton from "@/components/OrderButton";
import styles from "./product.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string) {
  return getProduct(slug).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();

  return (
    <>
      <PageHeader />
      <main className={`main container-narrow ${styles.product}`}>
        <p className={styles.breadcrumbs}>
          <Link href="/catalog">Каталог</Link>
          {product.categorySlug && (
            <>
              {" / "}
              <Link href={`/catalog/${product.categorySlug}`}>{product.categorySlug}</Link>
            </>
          )}
          {" / "}
          {product.name}
        </p>
        <div className={styles.layout}>
          <div className={styles.gallery}>
            {product.images.map((src, i) => (
              <img key={src} className={styles.mainImage} src={src} alt={`${product.name} — ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
            ))}
          </div>
          <div>
            <h1 className={styles.title}>{product.name}</h1>
            {product.price != null && <p className={styles.price}>{product.price} ₽</p>}
            {product.description && <p className={styles.description}>{product.description}</p>}
            <OrderButton productSlug={product.slug} productName={product.name} className={styles.orderButton} />
          </div>
        </div>
      </main>
    </>
  );
}
