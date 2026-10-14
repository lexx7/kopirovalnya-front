"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface SliderImage {
  src: string;
  alt: string;
}

export interface SliderContent {
  title: string;
  slides: SliderImage[];
}

export interface SliderBlockProps {
  content?: Partial<SliderContent>;
}

const defaultContent: SliderContent = {
  title: "Наши работы",
  slides: [
    { src: "/images/slider/1.jpg", alt: "" },
    { src: "/images/slider/2.jpg", alt: "" },
    { src: "/images/slider/3.jpg", alt: "" },
    { src: "/images/slider/2.jpg", alt: "" },
    { src: "/images/slider/3.jpg", alt: "" },
  ],
};

export function SliderBlock({ content }: SliderBlockProps) {
  const merged = { ...defaultContent, ...content };

  return (
    <section className="slider container-narrow" aria-labelledby="slider-title">
      <div className="slider__controls">
        <h2
          className="slider__title"
          aria-label="slider-title"
          id="slider-title"
        >
          {merged.title}
        </h2>
        <div className="slider__buttons hidden-mobile">
          <button
            className="slider__button slider__button-prev button"
            type="button"
          >
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.27946 14.4342L1.94446 8.09916L8.27946 1.76416"
                stroke="white"
                strokeWidth="2.49973"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="slider__button slider__button-next button"
            type="button"
          >
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.72054 14.4342L8.05554 8.09916L1.72054 1.76416"
                stroke="#2F2825"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <Swiper
        className="mySwiper"
        modules={[Navigation, Pagination]}
        slidesPerView={3}
        spaceBetween={20}
        loop={true}
        navigation={{
          nextEl: ".slider__button-next",
          prevEl: ".slider__button-prev",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 3,
          },
        }}
      >
        {merged.slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.src}
              alt={slide.alt}
              width="418"
              height="412"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
