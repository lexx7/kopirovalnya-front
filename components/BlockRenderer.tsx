import type { ComponentType } from "react";
import type { PageBlock } from "@/lib/types";
import { HeroBlock } from "./blocks/HeroBlock";
import { HeroAltBlock } from "./blocks/HeroAltBlock";
import { StylisticsBlock } from "./blocks/StylisticsBlock";
import { PossibilitiesBlock } from "./blocks/PossibilitiesBlock";
import { MaterialsBlock } from "./blocks/MaterialsBlock";
import { MaterialsAltBlock } from "./blocks/MaterialsAltBlock";
import { ProcessBlock } from "./blocks/ProcessBlock";
import { ProcessMainBlock } from "./blocks/ProcessMainBlock";
import { TimeBlock } from "./blocks/TimeBlock";
import { PriceTableBlock } from "./blocks/PriceTableBlock";
import { SliderBlock } from "./blocks/SliderBlock";
import { ReviewsBlock } from "./blocks/ReviewsBlock";
import { TechnologiesBlock } from "./blocks/TechnologiesBlock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, ComponentType<{ content?: any }>> = {
  hero: HeroBlock,
  "hero-alt": HeroAltBlock,
  stylistics: StylisticsBlock,
  possibilities: PossibilitiesBlock,
  materials: MaterialsBlock,
  "materials-alt": MaterialsAltBlock,
  process: ProcessBlock,
  "process-main": ProcessMainBlock,
  time: TimeBlock,
  "price-table": PriceTableBlock,
  slider: SliderBlock,
  reviews: ReviewsBlock,
  technologies: TechnologiesBlock,
};

export const HERO_TYPES = ["hero", "hero-alt"];

/** Блоки главной страницы по умолчанию (пока страница не создана в CMS) */
export const defaultHomeBlocks: PageBlock[] = [
  "hero",
  "stylistics",
  "possibilities",
  "materials",
  "process",
  "time",
  "price-table",
  "slider",
  "reviews",
].map((type, i) => ({ id: `default-${type}`, type, content: {}, sortOrder: i }));

export default function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = registry[block.type];
        if (!Component) return null;
        return <Component key={block.id} content={block.content} />;
      })}
    </>
  );
}
