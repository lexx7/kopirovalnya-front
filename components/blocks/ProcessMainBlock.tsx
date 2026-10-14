export interface ProcessMainItem {
  image: string;
  width: number;
  height: number;
  title: string;
  description: string;
  note?: string;
  variant: 'wide' | 'small';
  visibility: 'desktop' | 'mobile' | 'all';
}

export interface ProcessMainContent {
  title: string;
  items: ProcessMainItem[];
}

export const processMainDefaultContent: ProcessMainContent = {
  title: 'Как мы работаем',
  items: [
    {
      image: '/images/process/1.jpg',
      width: 366,
      height: 316,
      title: '1. Заказ',
      description: 'Оформите заказ на сайте, заполнив форму и загрузив исходные фотографии',
      variant: 'wide',
      visibility: 'desktop',
    },
    {
      image: '/images/process/2.jpg',
      width: 366,
      height: 316,
      title: '2. Консультация',
      description: 'Наши менеджеры свяжутся с Вами, помогут с выбором и уточнят детали заказа',
      note: '(Если потребуется)',
      variant: 'wide',
      visibility: 'desktop',
    },
    {
      image: '/images/process/3.jpg',
      width: 420,
      height: 236,
      title: '3. Доставка',
      description:
        'Вы можете забрать заказ в одном из наших уютных офисов самостоятельно либо заказать доставку курьером до дома',
      variant: 'small',
      visibility: 'all',
    },
    {
      image: '/images/process/4.jpg',
      width: 420,
      height: 236,
      title: '4. Оплата',
      description:
        'Вы сможете оплатить выбранные услуги: наличными при получении, безналичным способом в офисе или с юр. счета',
      variant: 'small',
      visibility: 'all',
    },
    {
      image: '/images/process/1_mobile.jpg',
      width: 340,
      height: 191,
      title: '1. Заказ',
      description: 'Оформите заказ на сайте, заполнив форму и загрузив исходные фотографии',
      variant: 'small',
      visibility: 'mobile',
    },
    {
      image: '/images/process/2_mobile.jpg',
      width: 340,
      height: 191,
      title: '2. Консультация',
      description: 'Наши менеджеры свяжутся с Вами, помогут с выбором и уточнят детали заказа',
      note: '(Если потребуется)',
      variant: 'small',
      visibility: 'mobile',
    },
    {
      image: '/images/process/5.jpg',
      width: 420,
      height: 236,
      title: '5. Акции и скидки',
      description:
        'Хотите быть в курсе наших конкурсов и распродаж? Следите за новостями на сайте и в наших соцсетях',
      variant: 'small',
      visibility: 'all',
    },
  ],
};

const visibilityClasses: Record<ProcessMainItem['visibility'], string> = {
  desktop: ' hidden-mobile',
  mobile: ' visible-mobile',
  all: '',
};

interface ProcessMainBlockProps {
  content?: Partial<ProcessMainContent>;
  onCtaClick?: () => void;
}

export function ProcessMainBlock({ content }: ProcessMainBlockProps) {
  const merged = { ...processMainDefaultContent, ...content };

  return (
    <section className="process process--main container-narrow" aria-labelledby="process-title">
      <h2 className="process__title" aria-label="process-title" id="process-title">
        {merged.title}
      </h2>
      <ul className="process__list">
        {merged.items.map((item, index) => (
          <li className={`process__item${visibilityClasses[item.visibility]}`} key={index}>
            <div
              className={`process__card card ${
                item.variant === 'wide' ? 'card--wide' : 'card--small'
              }`}
            >
              <img
                className={item.variant === 'wide' ? 'card__image card__image--wide' : 'card__image'}
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                loading="lazy"
              />
              <div
                className={
                  item.variant === 'wide' ? 'card__text' : 'card__text card__text--small'
                }
              >
                <h3 className="card__title">{item.title}</h3>
                <p className="card__description">
                  {item.description}
                  {item.note && item.variant === 'wide' && (
                    <>
                      <br />
                      <span className="possibilities__info possibilities__info--additional">
                        {item.note}
                      </span>
                    </>
                  )}
                  {item.note && item.variant !== 'wide' && (
                    <>
                      {' '}
                      <span className="possibilities__info possibilities__info--additional">
                        {item.note}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
