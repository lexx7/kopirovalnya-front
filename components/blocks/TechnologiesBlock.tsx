"use client";
import { openCallbackModal } from "@/lib/cta";
export interface TechnologiesCard {
  variant: 'first' | 'second';
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  buttonLabel: string;
  buttonAccent: boolean;
}

export interface TechnologiesContent {
  title: string;
  cards: TechnologiesCard[];
}

export const technologiesDefaultContent: TechnologiesContent = {
  title: 'Отличия технологий печати',
  cards: [
    {
      variant: 'first',
      title: 'Струйная технология печати',
      description:
        'Печать чернилами на фотобумаге при помощи компактного профессионального оборудования в условиях фотосалона',
      pros: [
        'Короткие сроки изготовления (от 3 минут)',
        'Любой тираж (от 1 фотографии)',
        'Низкая стоимость по сравнению с фотолабораторией',
      ],
      cons: ['Отпечаток более требователен к хранению, обладает'],
      buttonLabel: 'Оформить заказ (Струйная технология)',
      buttonAccent: true,
    },
    {
      variant: 'second',
      title: 'Печать на фотолаборатории',
      description:
        'Печать в условиях производства на промышленном оборудовании, используя “мокрою” технологию (как раньше)',
      pros: [
        'Износостойкий отпечаток к мех. повреждениям и влаге',
        'Гарантия от выцветания 70 лет',
        'Точная цветопередача всех оттенков на фотографии',
      ],
      cons: ['Срок изготовления от 5 рабочих дней', 'Тираж от 50 штук'],
      buttonLabel: 'Оформить заказ (фотолаборатория)',
      buttonAccent: false,
    },
  ],
};

function CheckIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.332031" width="14" height="14" rx="7" fill="#F9A317" />
      <path
        d="M9.79995 5.23193L5.94995 9.43193L4.19995 7.52284"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.332031" width="14" height="14" rx="7" fill="#BF1539" />
      <path
        d="M9.79995 4.53223L4.19995 10.1322M4.19995 4.53223L9.79995 10.1322"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface TechnologiesBlockProps {
  content?: Partial<TechnologiesContent>;
  onCtaClick?: () => void;
}

export function TechnologiesBlock({ content, onCtaClick }: TechnologiesBlockProps) {
  const merged = { ...technologiesDefaultContent, ...content };

  return (
    <section className="technologies container-narrow" aria-labelledby="technologies-title">
      <h2 className="technologies__title" title="technologies-title" id="technologies-title">
        {merged.title}
      </h2>
      <ul className="technologies__list">
        {merged.cards.map((card, index) => (
          <li className="technologies__item" key={index}>
            <div className={`technologies__card technologies__card--${card.variant}`}>
              <header className="technologies__card-header">
                <h3 className="technologies__card-header-title">{card.title}</h3>
                <p className="technologies__card-description">{card.description}</p>
              </header>
              <div className="technologies__card-main">
                <div className="technologies__card-pros">
                  <h4 className="technologies__card-title">Преимущества:</h4>
                  {card.pros.map((pro, proIndex) => (
                    <p className="technologies__card-info" key={proIndex}>
                      <CheckIcon />
                      {pro}
                    </p>
                  ))}
                </div>
                <div className="technologies__card-cons">
                  <h4 className="technologies__card-title">Недостатки:</h4>
                  {card.cons.map((con, conIndex) => (
                    <p className="technologies__card-info" key={conIndex}>
                      <CrossIcon />
                      {con}
                    </p>
                  ))}
                </div>
                <button
                  className={`technologies__card-button${
                    card.buttonAccent ? ' technologies__card-button--yellow' : ''
                  } button`}
                  type="button"
                  onClick={() => openCallbackModal()}
                >
                  {card.buttonLabel}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
