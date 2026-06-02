'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { SplitText } from 'gsap/SplitText';
import Link from 'next/link';
import HeroHeader, { LinkType } from './header';

const TOTAL_VIDEOS = 2;

gsap.registerPlugin(useGSAP, SplitText);

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [allReady, setAllReady] = useState(false);
  const readyCount = useRef(0);

  const container = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  const getVideoSrc = (index: number) =>
    `${process.env.NEXT_PUBLIC_VIDEO_SRC}/clip-${index}.mp4`;

  const headerLinks: LinkType[] = [{ name: 'Alunos', href: '/alunos' }];

  useEffect(() => {
    readyCount.current = 0;

    const videos = Array.from({ length: TOTAL_VIDEOS }, (_, i) => {
      const vid = document.createElement('video');
      vid.src = getVideoSrc(i + 1);
      vid.preload = 'auto';
      vid.muted = true;

      vid.addEventListener(
        'canplaythrough',
        () => {
          readyCount.current += 1;
          if (readyCount.current === TOTAL_VIDEOS) {
            setAllReady(true);
          }
        },
        { once: true },
      );

      return vid;
    });

    return () => {
      videos.forEach((v) => {
        v.src = '';
      });
    };
  }, []);

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
      const split = SplitText.create('#hero-txt', {
        type: 'words, chars',
      });

      gsap
        .timeline()
        .from(split.chars, {
          y: 40,
          opacity: 0,
          stagger: 0.05,
          duration: 2,
          ease: 'power3.out',
        })
        .from(
          [subtitleRef.current, btnRef.current],
          {
            y: 20,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: `power2.out`,
          },
          `-=1`,
        );
    },
    { scope: container },
  );

  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      {!allReady && (
        <div className='flex-center absolute z-50 h-dvh w-screen overflow-hidden bg-amber-100'>
          <div className='loading-body'>
            <div className='loading-dots' />
            <div className='loading-dots' />
            <div className='loading-dots' />
          </div>
        </div>
      )}
      <div
        id='video-frame'
        className='relative h-dvh w-screen overflow-hidden rounded-lg bg-sky-50'
      >
        <div className='absolute-center w-screen h-dvh'>
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
              />
            );
          })}
          <div className='absolute inset-0 bg-black/50' />
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-dvh'>
        <div className='flex flex-col justify-between pt-4 pb-12 px-64 w-full h-full'>
          <HeroHeader links={headerLinks} />
          <div
            ref={container}
            className='flex items-end justify-start lg:gap-44 gap-24'
          >
            <h2
              id='hero-txt'
              className='uppercase text-[9rem] leading-36 italic tracking-wide font-heading-serif font-semibold text-amber-50'
            >
              Tired <br />
              of waiting?
            </h2>
            <div className='flex flex-col gap-4 items-start w-fit max-w-64'>
              <span
                ref={subtitleRef}
                className='text-2xl font-sans w-full font-medium'
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
  );
}
