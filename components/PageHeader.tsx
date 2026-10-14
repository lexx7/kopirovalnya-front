import { getLayout } from "@/lib/api";
import type { HeaderContent } from "./Header";
import Header from "./Header";

/** Header для страниц без hero-блока (каталог, товар, 404) */
export default async function PageHeader() {
  const layout = await getLayout().catch(() => null);
  return (
    <Header
      header={(layout?.header ?? {}) as HeaderContent}
      menu={layout?.menu?.header ?? []}
    />
  );
}
