import { Fragment } from "react";

export interface ProcessItem {
  title: string;
  description: string;
  additional?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  wide?: boolean;
  mobileImage?: string;
  mobileImageWidth?: number;
  mobileImageHeight?: number;
}

export interface ProcessContent {
  title: string;
  items: ProcessItem[];
}

export interface ProcessBlockProps {
  content?: Partial<ProcessContent>;
}

const defaultContent: ProcessContent = {
  title: "Как мы работаем",
  items: [
    {
      title: "1. Заказ",
      description:
        "Оформите заказ на сайте, заполнив форму и загрузив исходные фотографии",
      image: "/images/process/1.jpg",
      imageWidth: 366,
      imageHeight: 316,
      wide: true,
      mobileImage: "/images/process/1_mobile.jpg",
      mobileImageWidth: 340,
      mobileImageHeight: 191,
    },
    {
      title: "2. Консультация",
      description:
        "Наши менеджеры свяжутся с Вами, помогут с выбором и уточнят детали заказа",
      additional: "(Если потребуется)",
      image: "/images/process/2.jpg",
      imageWidth: 366,
      imageHeight: 316,
      wide: true,
      mobileImage: "/images/process/2_mobile.jpg",
      mobileImageWidth: 340,
      mobileImageHeight: 191,
    },
    {
      title: "3. Доставка",
      description:
        "Вы можете забрать заказ в одном из наших уютных офисов самостоятельно либо  заказать доставку курьером до дома",
      image: "/images/process/3.jpg",
      imageWidth: 420,
      imageHeight: 236,
    },
    {
      title: "4. Оплата",
      description:
        "Вы сможете оплатить выбранные услуги: наличными при получении, безналичным способом в офисе или с юр. счета",
      image: "/images/process/4.jpg",
      imageWidth: 420,
      imageHeight: 236,
    },
    {
      title: "5. Акции и скидки",
      description:
        "Хотите быть в курсе наших конкурсов и распродаж? Следите за новостями на сайте и в наших соцсетях",
      image: "/images/process/5.jpg",
      imageWidth: 420,
      imageHeight: 236,
    },
  ],
};

function ProcessDescription({ item }: { item: ProcessItem }) {
  return (
    <p className="card__description">
      {item.description}
      {item.additional && (
        <>
          <br />
          <span className="possibilities__info possibilities__info--additional">
            {item.additional}
          </span>
        </>
      )}
    </p>
  );
}

export function ProcessBlock({ content }: ProcessBlockProps) {
  const merged = { ...defaultContent, ...content };

  return (
    <section
      className="process container-narrow"
      aria-labelledby="process-title"
    >
      <h2
        className="process__title"
        aria-label="process-title"
        id="process-title"
      >
        {merged.title}
      </h2>
      <ul className="process__list">
        {merged.items.map((item, index) => (
          <Fragment key={index}>
            <li
              className={`process__item${item.wide ? " hidden-mobile" : ""}`}
            >
              <div
                className={`process__card card${item.wide ? " card--wide" : " card--small"}`}
              >
                <img
                  className={`card__image${item.wide ? " card__image--wide" : ""}`}
                  src={item.image}
                  alt=""
                  width={item.imageWidth}
                  height={item.imageHeight}
                  loading="lazy"
                />
                <div
                  className={`card__text${item.wide ? "" : " card__text--small"}`}
                >
                  <h3 className="card__title">{item.title}</h3>
                  <ProcessDescription item={item} />
                </div>
              </div>
            </li>
            {item.mobileImage && (
              <li className="process__item visible-mobile">
                <div className="process__card card card--small">
                  <img
                    className="card__image"
                    src={item.mobileImage}
                    alt=""
                    width={item.mobileImageWidth}
                    height={item.mobileImageHeight}
                    loading="lazy"
                  />
                  <div className="card__text card__text--small">
                    <h3 className="card__title">{item.title}</h3>
                    <ProcessDescription item={item} />
                  </div>
                </div>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
