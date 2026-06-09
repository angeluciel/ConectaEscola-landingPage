'use client';
import { useGSAP } from '@gsap/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';

type ScrollbarMode =
  | 'idle'
  | 'scrollReveal'
  | 'hotzoneHover'
  | 'trackHover'
  | 'thumbHover'
  | 'dragging';

const ANIMATION_MODE = {
  DRAGGING: 'dragging',
  THUMB_HOVER: 'thumbHover',
  TRACK_HOVER: 'trackHover',
  HOVER: 'hotzoneHover',
  SCROLL_REVEAL: 'scroll_reveal',
  IDLE: 'idle',
} as const;

type AnimationMode = (typeof ANIMATION_MODE)[keyof typeof ANIMATION_MODE];

gsap.registerPlugin(useGSAP);

export function CustomScroll() {
  const lenis = useLenis();
  const thumbRef = useRef(null);
  const trackRef = useRef(null);

  const [isHover, setIsHover] = useState(false);
  const [isTrackHover, setIsTrackHover] = useState(false);
  const [isThumbHover, setIsThumbHover] = useState(false);
  const [isScrollReveal, setIsScrollReveal] = useState(false);
  const [isDragging, setisDragging] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animationMode: AnimationMode = isDragging
    ? 'dragging'
    : isThumbHover
      ? 'thumbHover'
      : isTrackHover
        ? 'trackHover'
        : isHover
          ? 'hotzoneHover'
          : isScrollReveal
            ? 'scroll_reveal'
            : 'idle';

  useLayoutEffect(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;

    if (!thumb || !track) return;

    switch (animationMode) {
      case 'idle':
        gsap.to(thumb, { scaleX: 0, overwrite: 'auto' });
        gsap.to(track, { opacity: 0, overwrite: 'auto' });
    }
  }, [animationMode]);

  const hotzoneEnter = () => {
    if (isDragging) return;

    gsap.to('#hotTrigger', {
      scaleX: 1,
      duration: 0.1,
      ease: 'power4.out',
    });
  };
  const hotzoneLeave = () => {
    gsap.to('#hotTrigger', {
      scaleX: 0,
      duration: 0.2,
      ease: 'power4.out',
    });
  };

  useEffect(() => {}, [lenis]);

  return (
    <div
      className='fixed z-999 w-[25dvw] hidden md:block h-dvh top-0 right-0 bottom-0 bg-emerald-500/10'
      onMouseEnter={hotzoneEnter}
      onMouseLeave={hotzoneLeave}
    >
      <div className='h-full absolute w-5 right-0 top-0 group/track'>
        <div
          className='h-full bg-sky-500/25 w-4 absolute right-0 top-0 bottom-0 transition-all duration-150 opacity-0 group-hover/track:opacity-100'
          ref={trackRef}
        ></div>
      </div>
      <div
        className='h-12 w-2 scale-x-0 origin-center absolute right-1 top-6 bg-sky-500/50 rounded-sm transition-transform duration-100 ease-in'
        id='hotTrigger'
        ref={thumbRef}
      ></div>
    </div>
  );
}
