"use client";

import { openCallbackModal } from "@/lib/cta";

export interface HeroContent {
  pathRoot: string;
  pathCurrent: string;
  title: string;
  description: string;
  list: string[];
  buttonText: string;
  mobileImage: string;
}

export interface HeroBlockProps {
  content?: Partial<HeroContent>;
  onCtaClick?: () => void;
}

const defaultContent: HeroContent = {
  pathRoot: "Главная",
  pathCurrent: "Портрет на холсте",
  title: "Cтильный портрет на холсте",
  description:
    "Тщательная работа над фотографией, внимание к деталям и высочайшее качество печати",
  list: [
    "Понравится каждому человеку",
    "Впишется в любой интерьер",
    "Отличный подарок на любой повод и праздник",
  ],
  buttonText: "Оформить заказ",
  mobileImage: "/images/hero/hero_bg-main-mobile.jpg",
};

export function HeroBlock({ content, onCtaClick }: HeroBlockProps) {
  const merged = { ...defaultContent, ...content };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container-narrow">
        <div className="hero__content">
          <div className="hero__info">
            <p className="hero__path">
              <span className="hero__path hero__path--gray">{merged.pathRoot}</span>
              {"  /  "}
              {merged.pathCurrent}
            </p>
            <h1 className="hero__title" aria-label="hero-title" id="hero-title">
              {merged.title}
            </h1>
          </div>
          <div className="hero__description">
            <p>{merged.description}</p>
          </div>
          <ul className="hero__list">
            {merged.list.map((text, index) => (
              <li className="hero__item" key={index}>
                <img
                  src="/icons/hero_list_marker.svg"
                  alt=""
                  width="10"
                  height="10"
                  loading="lazy"
                />
                <p className="hero__text">{text}</p>
              </li>
            ))}
          </ul>
          <button
            className="hero__button button hidden-mobile"
            type="button"
            onClick={() => openCallbackModal()}
          >
            {merged.buttonText}
          </button>
        </div>
      </div>
      <img
        className="hero__wrapper-mobile visible-mobile"
        src={merged.mobileImage}
        alt=""
        width="964"
        height="461"
        loading="lazy"
      />
      <button
        className="hero__button button visible-mobile"
        type="button"
        onClick={() => openCallbackModal()}
      >
        {merged.buttonText}
      </button>
    </section>
  );
}
