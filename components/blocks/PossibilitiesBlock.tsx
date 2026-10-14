export interface PossibilityItem {
  icon: string;
  text: string;
  additional?: string;
}

export interface PossibilitiesContent {
  title: string;
  items: PossibilityItem[];
}

export interface PossibilitiesBlockProps {
  content?: Partial<PossibilitiesContent>;
}

const defaultContent: PossibilitiesContent = {
  title: "У нас вы можете",
  items: [
    {
      icon: "/images/possibilities/1.svg",
      text: "Получить эскиз дизайнера перед изготовлением картины",
    },
    {
      icon: "/images/possibilities/2.svg",
      text: "Упаковать картину и придать подарку праздничный вид",
    },
    {
      icon: "/images/possibilities/3.svg",
      text: "Высказать свои пожелания и получить исправления бесплатно!",
    },
    {
      icon: "/images/possibilities/4.svg",
      text: "Заказать бережную доставку до двери нашим курьером",
    },
    {
      icon: "/images/possibilities/5.svg",
      text: "У нас можно оформить заказ онлайн без визита в мастерскую",
    },
    {
      icon: "/images/possibilities/6.svg",
      text: "Получить скидку при заказе нескольких портретов",
      additional: "(Уточняйте у менеджеров)",
    },
  ],
};

export function PossibilitiesBlock({ content }: PossibilitiesBlockProps) {
  const merged = { ...defaultContent, ...content };

  return (
    <section
      className="possibilities container-narrow"
      aria-labelledby="possibilities-title"
    >
      <h2
        className="possibilities__title"
        aria-label="possibilities-title"
        id="possibilities-title"
      >
        {merged.title}
      </h2>
      <ul className="possibilities__list">
        {merged.items.map((item, index) => (
          <li className="possibilities__item" key={index}>
            <img
              className="possibilities__icon"
              src={item.icon}
              alt=""
              width="97"
              height="97"
              loading="lazy"
            />
            <p className="possibilities__info">
              {item.text}
              {item.additional && (
                <>
                  <br />
                  <span className="possibilities__info possibilities__info--additional">
                    {item.additional}
                  </span>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
