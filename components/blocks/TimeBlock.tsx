import { Fragment } from "react";

export interface TimeSegment {
  text: string;
  variant?: "bold" | "yellow";
}

export interface TimeContent {
  title: string;
  titleYellow: string;
  descriptions: TimeSegment[][];
  image: string;
}

export interface TimeBlockProps {
  content?: Partial<TimeContent>;
}

const defaultContent: TimeContent = {
  title: "Студия портретов",
  titleYellow: "работает ежедневно",
  descriptions: [
    [
      { text: "Если торопиться некуда," },
      { text: " выполним работу", variant: "bold" },
      { text: " " },
      { text: "за 2-3 дня", variant: "yellow" },
    ],
    [
      { text: "Возможно  " },
      { text: "срочное изготовление", variant: "bold" },
      { text: " в течение дня " },
      { text: "без нервов и доплат", variant: "bold" },
    ],
  ],
  image: "/images/time/bg.jpg",
};

export function TimeBlock({ content }: TimeBlockProps) {
  const merged = { ...defaultContent, ...content };

  return (
    <section className="time container-narrow" aria-labelledby="time-title">
      <img
        className="time__image"
        src={merged.image}
        alt=""
        width="668"
        height="557"
        loading="lazy"
      />
      <div className="time__main">
        <h2 className="time__title" aria-label="time-title" id="time-title">
          {merged.title}{" "}
          <span className="time__title time__title--yellow">
            {merged.titleYellow}
          </span>
        </h2>
        <div className="time__info">
          {merged.descriptions.map((segments, index) => (
            <p className="time__description" key={index}>
              {segments.map((segment, segmentIndex) =>
                segment.variant ? (
                  <span
                    className={`time__description--${segment.variant}`}
                    key={segmentIndex}
                  >
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={segmentIndex}>{segment.text}</Fragment>
                )
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
