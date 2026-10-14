import { getLayout } from "@/lib/api";
import type { PageBlock } from "@/lib/types";
import type { HeaderContent } from "./Header";
import Header from "./Header";
import type { FooterContent } from "./Footer";
import BlockRenderer, { HERO_TYPES } from "./BlockRenderer";

/**
 * Каркас страницы CMS: header + hero-блок в общей обёртке с фоном,
 * остальные блоки — в <main>. Footer рендерится в root layout.
 */
export default async function PageShell({ blocks }: { blocks: PageBlock[] }) {
  const layout = await getLayout().catch(() => null);
  const header = (layout?.header ?? {}) as HeaderContent;
  const menu = layout?.menu?.header ?? [];

  const [first, ...rest] = blocks;
  const heroBlock = first && HERO_TYPES.includes(first.type) ? first : null;
  const wrapperClass =
    first?.type === "hero-alt" ? "hero__wrapper hero__wrapper--main" : "hero__wrapper";

  return (
    <>
      {heroBlock ? (
        <div className={wrapperClass}>
          <Header header={header} menu={menu} />
          <BlockRenderer blocks={[heroBlock]} />
        </div>
      ) : (
        <Header header={header} menu={menu} />
      )}
      <main className="main">
        <BlockRenderer blocks={heroBlock ? rest : blocks} />
      </main>
    </>
  );
}
