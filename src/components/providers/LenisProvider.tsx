'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LenisProvider({
  children,
  options = {},
}: {
  children: React.ReactNode;
  options?: LenisOptions;
}) {
  const optionsRef = useRef(options);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis?.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: 1.2,
        anchors: true,
        touchMultiplier: 2,
        syncTouch: false,
        infinite: false,
        ...options,
      }}
    >
      {children}
    </ReactLenis>
  );
}
