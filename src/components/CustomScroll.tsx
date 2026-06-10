'use client';
import { useGSAP } from '@gsap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';

const ANIMATION_MODE = {
  DRAGGING: 'dragging',
  THUMB_HOVER: 'thumbHover',
  TRACK_HOVER: 'trackHover',
  HOVER: 'hotzoneHover',
  SCROLL_REVEAL: 'scrollReveal',
  IDLE: 'idle',
} as const;

type AnimationMode = (typeof ANIMATION_MODE)[keyof typeof ANIMATION_MODE];

gsap.registerPlugin(useGSAP);

export function CustomScroll() {
  const lenis = useLenis();

  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ offsetY: number }>(null);

  const [isHover, setIsHover] = useState(false);
  const [isTrackHover, setIsTrackHover] = useState(false);
  const [isThumbHover, setIsThumbHover] = useState(false);
  const [isScrollReveal, setIsScrollReveal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const dragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    setIsThumbHover(false);
    setIsDragging(true);

    const thumbRect = thumb.getBoundingClientRect();

    dragStateRef.current = {
      offsetY: event.clientY - thumbRect.top,
    };
  };

  // DRAG
  useEffect(() => {
    if (!isDragging || !lenis) return;

    const handleMove = (event: PointerEvent) => {
      const track = trackRef.current;
      if (!track || !dragStateRef.current) return;

      const trackRect = track.getBoundingClientRect();

      const trackSize = trackRect.height;
      const viewportHeight = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;
      const scrollLimit = lenis.limit;

      const thumbSize = Math.max(
        (viewportHeight / contentHeight) * trackSize,
        40,
      );

      const maxThumbTravel = trackSize - thumbSize;

      const rawThumbPosition =
        event.clientY - trackRect.top - dragStateRef.current.offsetY;

      const thumbPosition = Math.min(
        Math.max(rawThumbPosition, 0),
        maxThumbTravel,
      );

      const progress = maxThumbTravel > 0 ? thumbPosition / maxThumbTravel : 0;

      const targetScroll = progress * scrollLimit;

      lenis.scrollTo(targetScroll, {
        immediate: true,
      });
    };

    const handleUp = () => {
      setIsDragging(false);
      dragStateRef.current = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging, lenis]);

  useLenis(({ scroll, isScrolling, limit }) => {
    const thumb = thumbRef.current;
    const track = trackRef.current;

    if (!thumb || !track) return;

    // #region scroll variables

    const trackSize = window.innerHeight;

    const viewportHeight = window.innerHeight;
    const contentHeight = document.documentElement.scrollHeight;

    const scrollLimit = limit;

    const thumbSize = Math.max(
      (viewportHeight / contentHeight) * trackSize,
      40,
    );

    const scrollProgress = scrollLimit > 0 ? scroll / limit : 0;
    const thumbPosition = scrollProgress * (trackSize - thumbSize);

    // #endregion

    gsap.set(thumb, {
      height: thumbSize,
      y: thumbPosition,
    });

    if (isScrolling) setIsScrollReveal(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsScrollReveal(false);
      timeoutRef.current = null;
    }, 1200);
  });

  useEffect(() => {
    const clearHoverState = () => {
      setIsThumbHover(false);
      setIsTrackHover(false);
      setIsDragging(false);
    };

    window.addEventListener('pointerup', clearHoverState);
    window.addEventListener('pointercancel', clearHoverState);
    window.addEventListener('blur', clearHoverState);

    return () => {
      window.removeEventListener('pointerup', clearHoverState);
      window.removeEventListener('pointercancel', clearHoverState);
      window.removeEventListener('blur', clearHoverState);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const animationMode: AnimationMode = isDragging
    ? 'dragging'
    : isThumbHover
      ? 'thumbHover'
      : isTrackHover
        ? 'trackHover'
        : isHover
          ? 'hotzoneHover'
          : isScrollReveal
            ? 'scrollReveal'
            : 'idle';

  useGSAP(
    () => {
      const thumb = thumbRef.current;
      const track = trackRef.current;

      const thumbColor = '#b45309';
      const hoverThumb = '#964a0f';

      if (!thumb || !track) return;

      switch (animationMode) {
        case 'idle':
          gsap.to(thumb, {
            scaleX: 0,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          gsap.to(track, {
            opacity: 0,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          break;
        case 'scrollReveal':
          gsap.to(thumb, {
            scaleX: 1,
            backgroundColor: thumbColor,
            overwrite: 'auto',
            duration: 0.1,
            ease: 'power4.out',
          });
          break;
        case 'hotzoneHover':
          gsap.to(thumb, {
            scaleX: 1,
            backgroundColor: thumbColor,
            overwrite: 'auto',
            duration: 0.1,
            ease: 'power4.out',
          });
          gsap.to(track, {
            opacity: 0,
            overwrite: 'auto',
            duration: 0.15,
            ease: 'power4.out',
          });
          break;
        case 'trackHover':
          gsap.to(thumb, {
            scaleX: 1,
            backgroundColor: thumbColor,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          gsap.to(track, {
            opacity: 1,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          break;
        case 'thumbHover':
          gsap.to(thumb, {
            scaleX: 1,
            backgroundColor: hoverThumb,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          gsap.to(track, {
            opacity: 1,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
          break;
        case 'dragging':
          gsap.to(thumb, {
            scaleX: 1,
            overwrite: 'auto',
            backgroundColor: '#fff',
            duration: 0.1,
            ease: 'power4.out',
          });
          gsap.to(track, {
            opacity: 0,
            overwrite: 'auto',
            duration: 0.2,
            ease: 'power4.out',
          });
      }
    },
    { dependencies: [animationMode] },
  );

  // #region ENTER-LEAVE fns
  const hotzoneEnter = () => {
    if (isDragging) return;
    setIsHover(true);
  };
  const hotzoneLeave = () => {
    setIsHover(false);
  };

  const trackEnter = () => {
    if (isDragging) return;
    setIsTrackHover(true);
  };
  const trackLeave = () => {
    if (isDragging) return;
    setIsTrackHover(false);
  };

  const thumbEnter = () => {
    if (isDragging) return;
    setIsThumbHover(true);
  };
  const thumbLeave = () => {
    if (isDragging) return;
    setIsThumbHover(false);
  };
  // #endregion

  useEffect(() => {}, [lenis]);

  return (
    <div
      className='fixed z-9999 w-[25dvw] hidden md:block h-dvh top-0 right-0 bottom-0'
      onMouseEnter={hotzoneEnter}
      onMouseLeave={hotzoneLeave}
    >
      {/* TRACK-HOTZONE */}
      <div
        className='h-full absolute w-5 right-0 top-0'
        onMouseEnter={trackEnter}
        onMouseLeave={trackLeave}
      >
        {/* TRACK */}
        <div
          className='h-full bg-white/50 w-4 absolute right-0 top-0 bottom-0 opacity-0'
          ref={trackRef}
        ></div>
        {/* THUMB-HOTZONE */}
        <div
          className='w-5 absolute top-1 flex justify-end'
          id='thumb'
          onMouseEnter={thumbEnter}
          onMouseLeave={thumbLeave}
        >
          <div
            ref={thumbRef}
            id='thumb'
            className='top-1 w-2 scale-x-0 origin-center absolute right-1 bg-amber-700 rounded-sm'
            onPointerDown={dragStart}
          ></div>
        </div>
        {/* THUMB */}
      </div>
    </div>
  );
}
