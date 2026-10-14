"use client";
import { openCallbackModal } from "@/lib/cta";
export interface HeroAltFeature {
  icon: string;
  title: string;
  text: string;
}

export interface HeroAltContent {
  breadcrumbRoot: string;
  breadcrumbCurrent: string;
  title: string;
  description: string;
  features: HeroAltFeature[];
  ctaLabel: string;
  secondaryCtaLabel: string;
}

export const heroAltDefaultContent: HeroAltContent = {
  breadcrumbRoot: 'Главная',
  breadcrumbCurrent: 'Печать фотографий',
  title: 'Печать фотографий',
  description: 'Ярко, быстро и профессионально',
  features: [
    {
      icon: '/images/hero/hero-main__icon-1.svg',
      title: 'С любых носителей',
      text: 'Флешки, диски, телефоны, социальные сети, облачные технологии',
    },
    {
      icon: '/images/hero/hero-main__icon-2.svg',
      title: 'Яркие цвета',
      text: 'Наши принтеры настроены, бумага заправлена — мы готовы пополнять Ваши фотоальбомы!',
    },
    {
      icon: '/images/hero/hero-main__icon-3.svg',
      title: 'Удобно и выгодно',
      text: 'Печатаем от 1 шт. кадрируем, обрабатываем, меняем фон и что еще Вы бы хотели? Сделаем!',
    },
  ],
  ctaLabel: 'Оформить заказ',
  secondaryCtaLabel: 'Смотреть портфолио',
};

interface HeroAltBlockProps {
  content?: Partial<HeroAltContent>;
  onCtaClick?: () => void;
}

export function HeroAltBlock({ content, onCtaClick }: HeroAltBlockProps) {
  const merged = { ...heroAltDefaultContent, ...content };

  return (
    <section className="hero hero--alt" aria-labelledby="hero-title">
      <div className="container-narrow">
        <div className="hero__content">
          <div className="hero__info">
            <p className="hero__path">
              <span className="hero__path hero__path--gray">{merged.breadcrumbRoot}</span>
              {'  /  '}
              {merged.breadcrumbCurrent}
            </p>
            <h1 className="hero__title hero__title--main" aria-label="hero-title" id="hero-title">
              {merged.title}
            </h1>
          </div>
          <div className="hero__description">
            <p>{merged.description}</p>
          </div>
          <ul className="hero__list">
            {merged.features.map((feature, index) => (
              <li className="hero__item hero__item-main" key={index}>
                <img
                  className="hero__item-image"
                  src={feature.icon}
                  alt=""
                  width={63}
                  height={63}
                  loading="lazy"
                />
                <div className="hero__item-info">
                  <p className="hero__item-title">{feature.title}</p>
                  <p className="hero__text hero__text--main">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="hero__buttons">
            <button
              className="hero__button button hidden-mobile"
              type="button"
              onClick={() => openCallbackModal()}
            >
              {merged.ctaLabel}
            </button>
            <button
              className="hero__button hero__button--transparent button hidden-mobile"
              type="button"
            >
              {merged.secondaryCtaLabel}
            </button>
          </div>
        </div>
      </div>
      <button
        className="hero__button button visible-mobile"
        type="button"
        onClick={() => openCallbackModal()}
      >
        {merged.ctaLabel}
      </button>
    </section>
  );
}
