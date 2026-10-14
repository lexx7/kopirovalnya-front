'use client';

import { useRef, useState } from 'react';

export interface MaterialsAltSegment {
  text: string;
  bold?: boolean;
}

export interface MaterialsAltItem {
  icon: string;
  segments: MaterialsAltSegment[];
}

export interface MaterialsAltVideo {
  src: string;
  poster: string;
  width: number;
  height: number;
}

export interface MaterialsAltContent {
  titleFirst: string;
  titleSecond: string;
  titleAccent: string;
  items: MaterialsAltItem[];
  video: MaterialsAltVideo;
}

export const materialsAltDefaultContent: MaterialsAltContent = {
  titleFirst: 'Идеального подарка не',
  titleSecond: 'сущест...',
  titleAccent: 'Погодите-ка',
  items: [
    {
      icon: '/images/materials/list-icon.png',
      segments: [
        { text: 'Сохраните ', bold: true },
        { text: 'памятные ' },
        { text: 'воспоминания ', bold: true },
        { text: 'в фотографии' },
      ],
    },
    {
      icon: '/images/materials/list-icon.png',
      segments: [
        { text: 'Создайте ' },
        { text: 'свой дизайнерский фотоальбом', bold: true },
      ],
    },
    {
      icon: '/images/materials/list-icon.png',
      segments: [
        { text: 'Мы ' },
        { text: 'поможем отредактировать ', bold: true },
        { text: 'Ваши фотографии' },
      ],
    },
    {
      icon: '/images/materials/list-icon.png',
      segments: [
        { text: 'Дополните подарок ', bold: true },
        { text: 'кому угодно, фотографиями с его участием - это непременно запомнится!' },
      ],
    },
  ],
  video: {
    src: '/videos/example.mp4',
    poster: '/images/materials/video-poster.png',
    width: 632,
    height: 464,
  },
};

interface MaterialsAltBlockProps {
  content?: Partial<MaterialsAltContent>;
  onCtaClick?: () => void;
}

export function MaterialsAltBlock({ content }: MaterialsAltBlockProps) {
  const merged = { ...materialsAltDefaultContent, ...content };
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayButtonVisible, setPlayButtonVisible] = useState(true);

  const handlePlayButtonClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.controls = true;
    void video.play();
    setPlayButtonVisible(false);
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    setPlayButtonVisible(video.paused);
  };

  return (
    <section className="materials materials--alt container-narrow" aria-labelledby="materials-title">
      <div className="materials__main">
        <h2 className="materials__title" aria-label="materials-title" id="materials-title">
          {merged.titleFirst} <br />
          {merged.titleSecond}{' '}
          <span className="materials__title materials__title--yellow">{merged.titleAccent}</span>
        </h2>
        <ul className="materials__list">
          {merged.items.map((item, index) => (
            <li className="materials__item" key={index}>
              <img
                className="materials__icon"
                src={item.icon}
                alt=""
                width={32}
                height={32}
                loading="lazy"
              />
              <p className="materials__info">
                {item.segments.map((segment, segmentIndex) =>
                  segment.bold ? (
                    <span
                      className="materials__info materials__info--bold"
                      key={segmentIndex}
                    >
                      {segment.text}
                    </span>
                  ) : (
                    <span className="materials__info" key={segmentIndex}>
                      {segment.text}
                    </span>
                  )
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="video-card__player video-player" data-js-video-player>
        <video
          ref={videoRef}
          src={merged.video.src}
          poster={merged.video.poster}
          className="video-card__video"
          width={merged.video.width}
          height={merged.video.height}
          onPause={() => setPlayButtonVisible(true)}
          onEnded={() => setPlayButtonVisible(true)}
          onPlay={() => setPlayButtonVisible(false)}
          onClick={handleVideoClick}
        />
        <button
          className="video-player__play-button"
          type="button"
          data-js-video-player-play-button
          style={{ display: isPlayButtonVisible ? 'block' : 'none' }}
          onClick={handlePlayButtonClick}
        >
          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.86233 0.232279C1.64154 0.561102 0.601704 1.60786 0.283929 2.82792C0.135324 3.39858 0.130333 26.7159 0.278739 27.2734C0.846607 29.4069 3.20859 30.5485 5.17327 29.6389C6.0858 29.2164 24.2285 17.674 24.6547 17.2448C26.348 15.5395 26.0133 12.6049 23.9736 11.2732C23.5479 10.9953 5.71499 0.696131 5.27915 0.476517C4.59043 0.12946 3.61148 0.0305007 2.86233 0.232279Z"
              fill="#2F2825"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
