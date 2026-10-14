import Link from "next/link";
import type { ReactNode } from "react";
import type { MenuItem } from "@/lib/types";
import { RubricHeading } from "./Header";

export interface FooterContent {
  copyright?: string;
  phone?: string;
  socials?: { type: string; url: string }[];
}

const DEFAULT_PHONE = "+7 (963) 270 23 79";
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
  children,
}: {
  item: MenuItem;
  className?: string;
  children: ReactNode;
}) {
  const href = itemHref(item);
  if (/^https?:/.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
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

function DefaultFooterGrid() {
  return (
    <>
      <li className="header__overlay-rubric">
        <RubricHeading title="Фотоуслуги" />
        <Link className="header__overlay-rubric-link" href="/">
          Фотопечать
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Фото на документы
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Реставрация фото
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Выездная фотостудия
        </Link>
      </li>
      <li className="header__overlay-rubric">
        <RubricHeading title="Визитки" />
        <Link className="header__overlay-rubric-link" href="/">
          Стандартные визитки 90х50
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Евровизитки 85х55 мм
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Календарик (100 х70 мм)
        </Link>
      </li>
      <li className="header__overlay-rubric">
        <RubricHeading title="Листовки" />
        <Link className="header__overlay-rubric-link" href="/">
          Листовки на бумаге
        </Link>
        <Link className="header__overlay-rubric-link" href="/">
          Листовки на картоне
        </Link>
        <RubricHeading title="Буклеты" />
        <RubricHeading title="Афиши" alt />
      </li>
      <li className="header__overlay-rubric">
        <RubricHeading title="Фотоподарки" />
        <div className="header__overlay-rubric-cols">
          <div className="header__overlay-rubric-first-col">
            <Link className="header__overlay-rubric-link" href="/">
              Печать на кружках
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Печать на футболках
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Печать на подушках
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Изготовление магнитов
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Фотоплед
            </Link>
          </div>
          <div className="header__overlay-rubric-second-col">
            <Link className="header__overlay-rubric-link" href="/">
              Пазл на заказ
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Брелок гос номер
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Изготовление <br /> календарей
            </Link>
            <Link className="header__overlay-rubric-link" href="/">
              Прочее
            </Link>
          </div>
        </div>
      </li>
    </>
  );
}

function FooterMenuGrid({ menu }: { menu: MenuItem[] }) {
  const roots = sortMenu(menu.filter((item) => item.parentId === null));

  if (roots.length === 0) {
    return <DefaultFooterGrid />;
  }

  return (
    <>
      {roots.map((root) => {
        const children = sortMenu(menu.filter((item) => item.parentId === root.id));
        return (
          <li className="header__overlay-rubric" key={root.id}>
            <RubricHeading title={root.label} />
            {children.map((child) => (
              <MenuLink item={child} className="header__overlay-rubric-link" key={child.id}>
                {child.label}
              </MenuLink>
            ))}
          </li>
        );
      })}
    </>
  );
}

function DefaultFooterAccordion() {
  const rubrics: { title: string; links: string[] }[] = [
    { title: "Фотоуслуги", links: ["Фотопечать", "Фото на документы", "Реставрация фото", "Выездная фотостудия"] },
    { title: "Визитки", links: ["Стандартные визитки 90х50", "Евровизитки 85х55 мм", "Календарик (100 х70 мм)"] },
    { title: "Листовки", links: ["Листовки на бумаге", "Листовки на картоне"] },
    { title: "Буклеты", links: [] },
    { title: "Афиши", links: [] },
    {
      title: "Фотоподарки",
      links: [
        "Печать на кружках",
        "Печать на футболках",
        "Печать на подушках",
        "Изготовление магнитов",
        "Фотоплед",
        "Пазл на заказ",
        "Брелок гос номер",
        "Изготовление календарей",
        "Прочее",
      ],
    },
  ];

  return (
    <>
      {rubrics.map((rubric) => (
        <li className="accordion__item" key={rubric.title}>
          <details className="accordion__rubric">
            <AccordionHeader title={rubric.title} />
            {rubric.links.length > 0 && (
              <div className="accordion__rubric-body">
                <ul className="accordion__rubric-list">
                  {rubric.links.map((link) => (
                    <li className="accordion__rubric-item" key={link}>
                      <Link href="/" className="accordion__rubric-link">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </details>
        </li>
      ))}
    </>
  );
}

function FooterMenuAccordion({ menu }: { menu: MenuItem[] }) {
  const roots = sortMenu(menu.filter((item) => item.parentId === null));

  return (
    <div className="accordion">
      <ul className="accordion__list">
        {roots.length === 0 ? (
          <DefaultFooterAccordion />
        ) : (
          roots.map((root) => {
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
                            <MenuLink item={child} className="accordion__rubric-link">
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
          })
        )}
      </ul>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.7458 12.2354C15.0765 11.5746 14.2409 11.5746 13.5759 12.2354C13.0686 12.7384 12.5613 13.2414 12.0625 13.753C11.9261 13.8937 11.811 13.9235 11.6448 13.8297C11.3165 13.6507 10.9669 13.5057 10.6515 13.3096C9.18073 12.3846 7.94872 11.1952 6.85738 9.85668C6.31598 9.19167 5.83426 8.47976 5.49748 7.67834C5.42927 7.51634 5.44206 7.40977 5.57421 7.27762C6.08151 6.78739 6.57602 6.28436 7.0748 5.78134C7.76967 5.08222 7.76967 4.26374 7.07053 3.56036C6.67407 3.15965 6.27761 2.76746 5.88115 2.36675C5.4719 1.95751 5.06691 1.544 4.6534 1.13903C3.9841 0.486803 3.14855 0.486803 2.48352 1.14329C1.97195 1.64631 1.48171 2.16213 0.961616 2.65662C0.479894 3.11276 0.236901 3.6712 0.185745 4.32342C0.104747 5.38489 0.364792 6.38667 0.731412 7.36288C1.48171 9.3835 2.6242 11.1782 4.00968 12.8237C5.88115 15.0489 8.11498 16.8095 10.7282 18.0798C11.9048 18.6511 13.124 19.0901 14.4498 19.1626C15.3621 19.2138 16.155 18.9836 16.7902 18.2717C17.2251 17.7857 17.7153 17.3424 18.1757 16.8777C18.8578 16.1871 18.8621 15.3516 18.1842 14.6695C17.3743 13.8553 16.56 13.0453 15.7458 12.2354Z"
        fill="#313030"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.7397 1.90975L15.3744 7.72978L21.7397 13.5498C21.8547 13.3285 21.9245 13.0838 21.9245 12.8225V2.63703C21.9245 2.37572 21.8547 2.13108 21.7397 1.90975Z"
        fill="#313030"
      />
      <path
        d="M20.0799 0.939453H2.78095C2.49699 0.939453 2.23116 1.0037 1.99065 1.10959L10.1262 8.55869C10.8455 9.22067 12.0153 9.22067 12.7346 8.55869L20.8702 1.10959C20.6297 1.0037 20.3638 0.939453 20.0799 0.939453Z"
        fill="#313030"
      />
      <path
        d="M1.12116 1.90975C1.00609 2.13108 0.936279 2.37572 0.936279 2.63703V12.8225C0.936279 13.0838 1.00609 13.3285 1.12116 13.5498L7.48646 7.72978L1.12116 1.90975Z"
        fill="#313030"
      />
      <path
        d="M14.5049 8.52994L13.6041 9.35885C12.4055 10.4619 10.4552 10.4619 9.25665 9.35885L8.35596 8.52994L1.99065 14.35C2.23116 14.4559 2.49699 14.5201 2.78095 14.5201H20.0799C20.3638 14.5201 20.6297 14.4559 20.8702 14.35L14.5049 8.52994Z"
        fill="#313030"
      />
    </svg>
  );
}

export default function Footer({ footer, menu }: { footer: FooterContent; menu: MenuItem[] }) {
  const phone = footer.phone ?? DEFAULT_PHONE;
  const socials = footer.socials ?? DEFAULT_SOCIALS;

  const copyright: ReactNode = footer.copyright ?? (
    <>
      <time dateTime="2014">2014</time> - <time dateTime="2024">2024</time> Все права защищены
    </>
  );

  return (
    <>
      <footer className="footer container-narrow hidden-mobile">
        <div className="footer__main">
          <img
            className="footer__logo"
            src="/icons/logo.svg"
            alt="Логотип Cheese Photo"
            width={257}
            height={66}
            loading="lazy"
          />
          <div className="footer__contacts">
            <div className="footer__soc1als">
              <button className="footer__button button" type="button">
                <PhoneIcon />
              </button>
              <div className="footer__soc1als-info">
                <span className="footer__soc1als-text">Телефон</span>
                <a href={phoneHref(phone)} className="footer__soc1als-link">
                  {phone}
                </a>
              </div>
            </div>
            <div className="footer__soc1als">
              <button className="footer__button button" type="button">
                <MailIcon />
              </button>
              <div className="footer__soc1als-info">
                <span className="footer__soc1als-text">E-mail</span>
                <a href={`mailto:${DEFAULT_EMAIL}`} className="footer__soc1als-link footer__soc1als-link--mail">
                  {DEFAULT_EMAIL}
                </a>
              </div>
            </div>
            <div className="header__soc1als">
              <button className="button header__button" type="button">
                Заказать звонок
              </button>
              <SocialLinks socials={socials} />
            </div>
          </div>
        </div>
        <div className="footer__overlay header__overlay">
          <ul className="footer__overlay-grid header__overlay-grid">
            <FooterMenuGrid menu={menu} />
          </ul>
        </div>
      </footer>

      <div className="footer__other hidden-mobile">
        <span className="footer__datetime">{copyright}</span>
        <u className="class__footer-policy">Политика обработки персональных данных</u>
        <span className="footer__designed-by">
          Designed by <b>Vlad Rusak</b>
        </span>
      </div>

      <footer className="footer-mobile">
        <div className="footer-overlay-mobile visible-mobile">
          <div className="footer-overlay-mobile__head">
            <Link href="/" aria-label="Главная" title="Главная">
              <img
                src="/icons/logo.svg"
                alt="Логотип Cheese Photo"
                className="footer-overlay-mobile__logo"
                width={189}
                height={48}
              />
            </Link>
          </div>
          <div className="footer-overlay-mobile__main">
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
              <button className="button header__button" type="button">
                Обратный звонок
              </button>
              <SocialLinks socials={socials} />
            </div>
            <FooterMenuAccordion menu={menu} />
            <div className="footer-overlay-mobile__footer">
              <p className="footer-overlay-mobile__time">{copyright}</p>
              <p className="footer-overlay-mobile__policy">
                <Link href="/">
                  <u> Политика обработки персональных данных </u>
                </Link>
              </p>
              <p className="footer-overlay-mobile__designed">
                Designed by{" "}
                <b>
                  <u>Vlad Rusak</u>
                </b>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
