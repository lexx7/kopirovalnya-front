"use client";

import { openCallbackModal } from "@/lib/cta";

import { useEffect, useState } from "react";

export interface PriceTableItem {
  size: string;
  price: string;
}

export interface PriceTableImage {
  src: string;
  activeSrc: string;
  alt: string;
  width: number;
  height: number;
  sub: string;
}

export interface PriceTableContent {
  title: string;
  buttonText: string;
  swipeHint: string;
  sizeColumnTitle: string;
  priceColumnTitle: string;
  items: PriceTableItem[];
  description: string;
  descriptionBold: string;
  listTitle: string;
  images: PriceTableImage[];
  manImage: string;
  manImageMobile: string;
}

export interface PriceTableBlockProps {
  content?: Partial<PriceTableContent>;
  onCtaClick?: () => void;
}

const defaultContent: PriceTableContent = {
  title: "Оформить заказ",
  buttonText: "Оформить заказ",
  swipeHint: "Можно скролить влево",
  sizeColumnTitle: "Размер картины",
  priceColumnTitle: "Стоимость",
  items: [
    { size: "30x40", price: "1990" },
    { size: "40x40", price: "2400" },
    { size: "40x50", price: "2550" },
    { size: "40x60", price: "2550" },
    { size: "50x50", price: "2650" },
    { size: "50x60", price: "2850" },
    { size: "50x70", price: "3100" },
    { size: "55x80", price: "3500" },
    { size: "60x90", price: "4550" },
    { size: "70x100", price: "4950" },
    { size: "80x120", price: "5500" },
  ],
  description:
    "Обработка фото в различных стилях оплачивается отдельно и составляет ",
  descriptionBold: "700 ₽ за каждого человека на фото",
  listTitle: "Самые популярные размеры холстов",
  images: [
    {
      src: "/images/table/1.png",
      activeSrc: "/images/table/1-active.png",
      alt: "30x40",
      width: 90,
      height: 65,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/2.png",
      activeSrc: "/images/table/2-active.png",
      alt: "40x50",
      width: 90,
      height: 106,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/3.png",
      activeSrc: "/images/table/3-active.png",
      alt: "40x60",
      width: 90,
      height: 131,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/4.png",
      activeSrc: "/images/table/4-active.png",
      alt: "60x90",
      width: 227,
      height: 131,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/5.png",
      activeSrc: "/images/table/5-active.png",
      alt: "70x70",
      width: 143,
      height: 141,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/6.png",
      activeSrc: "/images/table/6-active.png",
      alt: "50x70",
      width: 132,
      height: 178,
      sub: "Как небольшая книга",
    },
    {
      src: "/images/table/7.png",
      activeSrc: "/images/table/7-active.png",
      alt: "70x100",
      width: 140,
      height: 182,
      sub: "Как небольшая книга",
    },
  ],
  manImage: "/images/table/man.png",
  manImageMobile: "/images/table/man-mobile.png",
};

function SwipeHintIcon() {
  return (
    <svg
      width="34"
      height="16"
      viewBox="0 0 34 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6">
        <path
          d="M7.335 14.3346L1 7.99955L7.335 1.66455"
          stroke="#2F2825"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="12.71"
          y="7.62451"
          width="8.25"
          height="0.75"
          rx="0.375"
          stroke="#2F2825"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.335 14.3346L32.67 7.99955L26.335 1.66455"
          stroke="#2F2825"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function PriceTableBlock({ content, onCtaClick }: PriceTableBlockProps) {
  const merged = { ...defaultContent, ...content };
  const [activeCell, setActiveCell] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeSize = merged.items[activeCell - 1]?.size;

  const selectCell = (cellNumber: number) => {
    setActiveCell(cellNumber);
  };

  return (
    <section className="table container-narrow" aria-labelledby="table-title">
      <div className="table__header">
        <h2
          className="table__header-title"
          aria-label="table-title"
          id="table-title"
        >
          {merged.title}
        </h2>
        <button
          className="table__header-button button hidden-mobile"
          type="button"
          onClick={() => openCallbackModal()}
        >
          {merged.buttonText}
        </button>

        <p className="table__header-swipe visible-mobile">
          {merged.swipeHint} <SwipeHintIcon />
        </p>
      </div>
      <div className="table__main">
        <table>
          <tbody>
            <tr className="table__row-first">
              <td>{merged.sizeColumnTitle}</td>
              {merged.items.map((item, index) => {
                const cellNumber = index + 1;
                return (
                  <td
                    key={cellNumber}
                    className={`table__first table__first--${cellNumber}${cellNumber === activeCell ? " is-active" : ""}`}
                    data-js-table-first=""
                    onClick={() => selectCell(cellNumber)}
                    onMouseEnter={() => {
                      if (!isMobile) selectCell(cellNumber);
                    }}
                  >
                    {item.size}
                  </td>
                );
              })}
            </tr>
            <tr className="table__row-second">
              <td>{merged.priceColumnTitle}</td>
              {merged.items.map((item, index) => {
                const cellNumber = index + 1;
                return (
                  <td
                    key={cellNumber}
                    className={`table__second table__second--${cellNumber}${cellNumber === activeCell ? " is-active" : ""}`}
                    data-js-table-second=""
                    onClick={() => selectCell(cellNumber)}
                    onMouseEnter={() => {
                      if (!isMobile) selectCell(cellNumber);
                    }}
                  >
                    {item.price} <span className="mini-ruble">₽</span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="table__description">
        {merged.description}
        <span className="table__description table__description--bold">
          {merged.descriptionBold}
        </span>
      </p>
      <button
        className="table__header-button button visible-mobile"
        type="button"
        onClick={() => openCallbackModal()}
      >
        {merged.buttonText}
      </button>
      <h3 className="table__title">{merged.listTitle}</h3>
      <p className="table__header-swipe visible-mobile">
        {merged.swipeHint} <SwipeHintIcon />
      </p>
      <ul className="table__list">
        {merged.images.map((image, index) => {
          const isActive = isMobile || image.alt === activeSize;
          return (
            <li className="table__item" key={index}>
              <div className="table__item-block">
                <img
                  className={`table__item-image${isActive ? " is-active" : ""}`}
                  src={isActive ? image.activeSrc : image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                />
              </div>
              <p
                className={`table__item-sub table__item-sub--${index + 1}${isActive ? "" : " visually-hidden"}`}
              >
                {image.sub}
              </p>
            </li>
          );
        })}
      </ul>
      <img
        className="table__man-image"
        src={merged.manImage}
        alt=""
        width="211"
        height="367"
        loading="lazy"
      />
      <img
        className="table__man-image-mobile visible-mobile"
        src={merged.manImageMobile}
        alt=""
        width="275"
        height="336"
        loading="lazy"
      />
    </section>
  );
}
