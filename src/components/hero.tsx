'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { SplitText } from 'gsap/SplitText';
import HeroHeader, { LinkType } from './header';

const TOTAL_VIDEOS = 2;

gsap.registerPlugin(useGSAP, SplitText);

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const container = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  const getVideoSrc = (index: number) =>
    `${process.env.NEXT_PUBLIC_VIDEO_SRC}/clip-${index}.mp4`;

  const nextIndex = (currentIndex % TOTAL_VIDEOS) + 1;

  const handleEnded = () => {
    const nextVideo = videoRefs.current[nextIndex - 1];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play();
    }
    setCurrentIndex(nextIndex);
  };

  useGSAP(
    () => {
      const heroSplit = SplitText.create('#hero-txt', {
        type: 'words, chars',
      });
      const btnSplit = SplitText.create('#btn-txt', {
        type: 'words',
      });

      gsap
        .timeline()
        .from(heroSplit.chars, {
          y: -100,
          opacity: 0,
          stagger: {
            each: 0.05,
            from: 'start',
          },
          duration: 3,
          ease: 'power3.out',
        })
        .from(
          btnSplit.words,
          {
            y: -60,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: `power2.out`,
          },
          `-=2`,
        )
        .from(
          [btnRef.current],
          {
            opacity: 0,
            duration: 2,
            stagger: 0.075,
            ease: `power2.out`,
          },
          '-=0.5',
        );
    },
    { scope: container },
  );

  return (
    <section className={'relative h-dvh w-full overflow-x-hidden z-50'}>
      <div>
        <div
          id='video-frame'
          className='relative h-dvh w-dvw overflow-hidden rounded-lg bg-sky-50'
        >
          <div className='absolute-center w-dvw h-dvh'>
            {Array.from({ length: TOTAL_VIDEOS }, (_, i) => {
              const index = i + 1;
              const isActive = index === currentIndex;
              return (
                <video
                  key={index}
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={getVideoSrc(index)}
                  autoPlay={isActive}
                  muted
                  playsInline
                  onEnded={isActive ? handleEnded : undefined}
                  className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-100 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  preload='auto'
                />
              );
            })}
            <div className='absolute inset-0 bg-black/50' />
          </div>
        </div>
        <div className='absolute top-0 left-0 w-full h-dvh'>
          <div className='flex flex-col justify-end pb-8 md:pb-12 px-8 md:px-[clamp(10rem,8vw+4rem,16rem)] w-full h-full pt-16'>
            <div
              ref={container}
              className='flex items-end justify-start gap-8 md:gap-24 xl:gap-44'
            >
              <h2
                id='hero-txt'
                className='uppercase text-display lg:text-hero md:leading-20 lg:leading-28 xl:leading-36 italic lg:tracking-wide font-heading-serif font-semibold text-amber-50 text-nowrap'
              >
                Tired <br />
                of waiting?
              </h2>
              <div className='flex flex-col gap-4 items-start w-fit max-w-52 xl:max-w-64'>
                <span
                  ref={subtitleRef}
                  className='text-2xl font-sans w-full font-medium text-end'
                  id='btn-txt'
                >
                  A fast and simple way to learn
                </span>
                <button
                  ref={btnRef}
                  className='text-sans h-16 rounded-sm flex px-12 font-medium w-full justify-center items-center bg-amber-100 text-amber-950 overflow-hidden group'
                >
                  <span className='shink-0'>Notify</span>
                  <span className='flex-1 flex items-center px-2 min-w-0 transition-all duration-400 group-hover:flex-0 group-hover:px-0.5 ease-out'>
                    <span className='h-px w-full bg-amber-950 opacity-40 transition-all duration-400 ease-out group-hover:scale-x-0 origin-center'></span>
                  </span>
                  <span className='shink-0'>Me</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
