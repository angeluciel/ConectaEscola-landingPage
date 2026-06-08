'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis } from './providers/LenisProvider';

export default function Scrollbar() {
  const lenis = useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);

  const updateScrollbar = useCallback(() => {
    if (!lenis || !trackRef.current || !thumbRef.current) return;

    const track = trackRef.current;
    const thumb = thumbRef.current;

    const trackHeight = track.clientHeight;
    const viewportHeight = window.innerHeight;
    const scrollLimit = lenis.limit;

    if (scrollLimit <= 0) {
      thumb.style.display = 'none';
      return;
    }

    thumb.style.display = 'block';

    const contentHeight = scrollLimit + viewportHeight;

    const thumbHeight = Math.max(
      40,
      (viewportHeight / contentHeight) * trackHeight,
    );

    const maxThumbY = trackHeight - thumbHeight;
    const thumbY = lenis.progress * maxThumbY;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(0, ${thumbY}px, 0)`;
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    updateScrollbar();

    const unsubscribe = lenis.on('scroll', updateScrollbar);

    function handleResize() {
      lenis?.resize();
      updateScrollbar();
    }
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [lenis, updateScrollbar]);

  const scrollFromPointer = useCallback(
    (clientY: number, offset = 0, immediate = true) => {
      if (!lenis || !trackRef.current || !thumbRef.current) return;

      const track = trackRef.current;
      const thumb = thumbRef.current;

      const trackRect = track.getBoundingClientRect();
      const thumbHeight = thumb.offsetHeight;
      const maxThumbY = trackRect.height - thumbHeight;

      const rawThumbY = clientY - trackRect.top - offset;

      const thumbY = Math.min(Math.max(rawThumbY, 0), maxThumbY);

      const progress = maxThumbY <= 0 ? 0 : thumbY / maxThumbY;
      const targetScroll = progress * lenis.limit;

      lenis.scrollTo(targetScroll, {
        immediate,
      });
    },
    [lenis],
  );

  function handleTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.target === thumbRef.current) return;

    const thumbHeight = thumbRef.current?.offsetHeight ?? 0;

    scrollFromPointer(event.clientY, thumbHeight / 2, false);
  }

  function handleThumbPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const thumb = thumbRef.current;
    if (!thumb) return;

    event.preventDefault();

    const thumbRect = thumb.getBoundingClientRect();

    dragOffsetRef.current = event.clientY - thumbRect.top;

    thumb.setPointerCapture(event.pointerId);
  }

  function handleThumbPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const thumb = thumbRef.current;
    if (!thumb?.hasPointerCapture(event.pointerId)) return;

    scrollFromPointer(event.clientY, dragOffsetRef.current, true);
  }

  function handleThumbPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const thumb = thumbRef.current;
    if (!thumb?.hasPointerCapture(event.pointerId)) return;

    thumb.releasePointerCapture(event.pointerId);
  }

  return (
    <div className='fixed top-4 right-2 z-9999 w-2 h-dvh pointer-events-auto'>
      <div
        className={`h-full w-full relative right-0 top-0 bg-black/50 hover:bg-foreground/50 cursor-pointer`}
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className='absolute top-0 right-0 min-h-10 rounded-4xl bg-amber-800 cursor-grab touch-none will-change-[transform,height] active:cursor-grabbing z-9999'
          ref={thumbRef}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
        ></div>
      </div>
    </div>
  );
}
