"use client";

import { openCallbackModal } from "@/lib/cta";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { MenuItem } from "@/lib/types";

export interface HeaderContent {
  city?: string;
  phone?: string;
  callbackLabel?: string;
  socials?: { type: string; url: string }[];
}

const DEFAULT_CITY = "г. Нижний Новгород";
const DEFAULT_PHONE = "+7 963 270 23 79";
const DEFAULT_CALLBACK_LABEL = "Заказать звонок";
const DEFAULT_EMAIL = "rgkrezh@mail.ru";
const DEFAULT_SOCIALS = [
  { type: "whatsapp", url: "#" },
  { type: "vk", url: "#" },
  { type: "mail", url: "#" },
];

const SOCIAL_ICONS: Record<string, { src: string; width: number; height: number; alt: string }> = {
  whatsapp: { src: "/icons/whatsup_icon.svg", width: 12, height: 12, alt: "WhatsApp" },
  vk: { src: "/icons/vk_icon.svg", width: 16, height: 10, alt: "ВКонтакте" },
  telegram: { src: "/icons/telegram-icon.svg", width: 17, height: 14, alt: "Telegram" },
  mail: { src: "/icons/mail_icon.svg", width: 14, height: 10, alt: "E-mail" },
};

function sortMenu(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function itemHref(item: MenuItem): string {
  const href = item.url ?? item.pageSlug ?? "/";
  return /^(\/|#|https?:|mailto:|tel:)/.test(href) ? href : `/${href}`;
}

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function MenuLink({
  item,
  className,
  onClick,
  children,
}: {
  item: MenuItem;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const href = itemHref(item);
  if (/^https?:/.test(href)) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function SocialLinks({ socials }: { socials: { type: string; url: string }[] }) {
  return (
    <>
      {socials.map(({ type, url }) => {
        const icon = SOCIAL_ICONS[type];
        if (!icon) return null;
        return (
          <a
            key={type}
            href={url}
            className="button--soc1als header__soc1als-button"
            aria-label={icon.alt}
            title={icon.alt}
          >
            <img src={icon.src} alt="" width={icon.width} height={icon.height} loading="lazy" />
          </a>
        );
      })}
    </>
  );
}

export function RubricHeading({ title, alt = false }: { title: string; alt?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`header__overlay-rubric-heading${alt ? " header__overlay-rubric-heading--alt" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className={`header__overlay-rubric-title${hovered ? " hovered" : ""}`}>{title}</h2>
      <div className={`header__overlay-rubric-line${hovered ? " hovered" : ""}`} />
    </div>
  );
}

function AccordionHeader({ title }: { title: string }) {
  return (
    <summary className="accordion__rubric-header">
      <div className="accordion__header">
        <h2 className="accordion__header-title">{title}</h2>
        <div className="accordion__header-line" />
        <img
          className="accordion__header-arrow"
          src="/icons/arrow-right.svg"
          alt=""
          width={5}
          height={10}
          loading="lazy"
        />
      </div>
    </summary>
  );
}

function MobileMenuAccordion({ menu, onLinkClick }: { menu: MenuItem[]; onLinkClick?: () => void }) {
  const roots = sortMenu(menu.filter((item) => item.parentId === null));

  return (
    <div className="accordion">
      <ul className="accordion__list">
        {roots.map((root) => {
          const children = sortMenu(menu.filter((item) => item.parentId === root.id));
          return (
            <li className="accordion__item" key={root.id}>
              <details className="accordion__rubric">
                <AccordionHeader title={root.label} />
                {children.length > 0 && (
                  <div className="accordion__rubric-body">
                    <ul className="accordion__rubric-list">
                      {children.map((child) => (
                        <li className="accordion__rubric-item" key={child.id}>
                          <MenuLink item={child} className="accordion__rubric-link" onClick={onLinkClick}>
                            {child.label}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BurgerIcon() {
  return (
    <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="19" height="2.6" rx="1.3" fill="#151515" />
      <rect y="7.2" width="12" height="2.6" rx="1.3" fill="#151515" />
      <rect y="14.4" width="19" height="2.6" rx="1.3" fill="#151515" />
    </svg>
  );
}

export default function Header({
  header,
  menu,
  onCallbackClick,
}: {
  header: HeaderContent;
  menu: MenuItem[];
  onCallbackClick?: () => void;
}) {
  const city = header.city ?? DEFAULT_CITY;
  const phone = header.phone ?? DEFAULT_PHONE;
  const callbackLabel = header.callbackLabel ?? DEFAULT_CALLBACK_LABEL;
  const socials = header.socials ?? DEFAULT_SOCIALS;

  const rootItems = sortMenu(menu.filter((item) => item.parentId === null));
  const hasChildItems = rootItems.some((root) => menu.some((item) => item.parentId === root.id));

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const catalogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayHovered = useRef(false);

  const clearCatalogTimer = () => {
    if (catalogTimer.current) {
      clearTimeout(catalogTimer.current);
      catalogTimer.current = null;
    }
  };

  const showCatalog = () => {
    clearCatalogTimer();
    overlayHovered.current = false;
    setCatalogOpen(true);
  };

  const hideCatalog = () => {
    clearCatalogTimer();
    setCatalogOpen(false);
  };

  const hideCatalogWithDelay = () => {
    clearCatalogTimer();
    catalogTimer.current = setTimeout(() => {
      if (!overlayHovered.current) {
        setCatalogOpen(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!catalogOpen) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        hideCatalog();
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideCatalog();
      }
    };

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [catalogOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-lock", mobileOpen);
    return () => document.documentElement.classList.remove("is-lock");
  }, [mobileOpen]);

  useEffect(() => clearCatalogTimer, []);

  return (
    <header className="header container-narrow" ref={rootRef}>
      <div className="header__info hidden-mobile">
        <span className="header__location">
          <img
            className="header__location-pin"
            src="/icons/location_pin.svg"
            alt=""
            width={9}
            height={13}
            loading="lazy"
          />
          {city}
        </span>

        <div className="header__contacts">
          <span>
            <a href={phoneHref(phone)} className="header__tel">
              {phone}
            </a>
          </span>
          <div className="header__soc1als">
            <button className="button header__button" type="button" onClick={() => openCallbackModal()}>
              {callbackLabel}
            </button>
            <SocialLinks socials={socials} />
          </div>
        </div>
      </div>

      <div className="header__main hidden-mobile">
        <div className="header__content">
          <Link href="/" aria-label="Главная" title="Главная">
            <img
              className="header__logo"
              src="/icons/logo.svg"
              alt="Сеть магазинов Cheese Photo"
              width={212}
              height={54}
            />
          </Link>
          <button
            className="header__catalog"
            type="button"
            aria-label="Открыть каталог"
            title="Открыть каталог"
            aria-expanded={catalogOpen}
            onMouseEnter={showCatalog}
            onMouseLeave={hideCatalogWithDelay}
            onClick={() => (catalogOpen ? hideCatalog() : showCatalog())}
          >
            <BurgerIcon />
            <span className="hidden-mobile">Каталог</span>
          </button>
        </div>
        <nav className="header__menu hidden-mobile">
          <ul className="header__menu-list">
            {rootItems.map((item) => (
              <li className="header__menu-item" key={item.id}>
                <MenuLink item={item} className="header__menu-link">
                  {item.label}
                </MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`header__overlay hidden-mobile${catalogOpen ? "" : " visually-hidden"}`}
        onMouseEnter={() => {
          overlayHovered.current = true;
          clearCatalogTimer();
        }}
        onMouseLeave={() => {
          overlayHovered.current = false;
          hideCatalogWithDelay();
        }}
      >
        <ul className="header__overlay-grid">
          {hasChildItems
            ? rootItems.map((root) => {
                const children = sortMenu(menu.filter((item) => item.parentId === root.id));
                return (
                  <li className="header__overlay-rubric" key={root.id}>
                    <RubricHeading title={root.label} />
                    {children.map((child) => (
                      <MenuLink
                        item={child}
                        className="header__overlay-rubric-link"
                        key={child.id}
                        onClick={hideCatalog}
                      >
                        {child.label}
                      </MenuLink>
                    ))}
                  </li>
                );
              })
            : rootItems.map((root) => (
                <li className="header__overlay-rubric" key={root.id}>
                  <MenuLink item={root} className="header__overlay-rubric-link" onClick={hideCatalog}>
                    {root.label}
                  </MenuLink>
                </li>
              ))}
        </ul>
      </div>

      <div className="header-overlay-mobile visible-mobile">
        <div className="header-overlay-mobile__head">
          <Link href="/" aria-label="Главная" title="Главная">
            <img
              src="/icons/logo.svg"
              alt="Логотип Cheese Photo"
              className="header-overlay-mobile__logo"
              width={189}
              height={48}
            />
          </Link>
          <button
            className={`header-overlay-mobile__catalog${mobileOpen ? " is-active" : ""}`}
            type="button"
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            title={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <BurgerIcon />
          </button>
        </div>
        <div className={`header-overlay-mobile__main${mobileOpen ? " is-active" : ""}`}>
          <MobileMenuAccordion menu={menu} onLinkClick={() => setMobileOpen(false)} />
          <div className="soc1als">
            <ul className="soc1als__list">
              <li className="soc1als__item">
                <div className="soc1als__links">
                  <b className="soc1als__links-name">Телефон</b>
                  <a href={phoneHref(phone)} className="soc1als__links-link">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="soc1als__item">
                <div className="soc1als__links">
                  <b className="soc1als__links-name">E-mail</b>
                  <a
                    href={`mailto:${DEFAULT_EMAIL}`}
                    className="soc1als__links-link soc1als__links-link--underlined"
                  >
                    {DEFAULT_EMAIL}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="header__soc1als">
            <button className="button header__button" type="button" onClick={() => openCallbackModal()}>
              {callbackLabel}
            </button>
            <SocialLinks socials={socials} />
          </div>
          <div className="header-overlay-mobile__footer">
            <p className="header-overlay-mobile__time">
              <time dateTime="2014">2014</time> - <time dateTime="2024">2024</time> Все права защищены
            </p>
            <p className="header-overlay-mobile__policy">
              <Link href="/">
                <u> Политика обработки персональных данных </u>
              </Link>
            </p>
            <p className="header-overlay-mobile__designed">
              Designed by{" "}
              <b>
                <u>Vlad Rusak</u>
              </b>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
