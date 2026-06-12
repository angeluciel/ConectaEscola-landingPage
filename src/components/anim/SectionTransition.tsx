'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function BubbleTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // The bubble path animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom', // when top of transition hits bottom of viewport
        end: 'bottom top', // when bottom of transition leaves top of viewport
        scrub: 1.5, // smoothness (higher = more "liquid" feel)
        pin: false,
      },
    });

    // Morph the path from flat → big bubble wipe → flat again
    tl.fromTo(
      pathRef.current,
      { attr: { d: 'M0 0 L0 0 Q0.5 0 1 0 L1 0 Z' } }, // start (flat)
      {
        attr: { d: 'M0 0 Q0.3 0.8 0.5 0.95 Q0.7 0.75 1 0 L1 0 Z' },
        ease: 'none',
      },
    );

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative h-[120vh] mt-[-20vh] pointer-events-none'
    >
      {/* Section 1 background color continues */}
      <div className='absolute inset-0 bg-[#f8f4eb]' />{' '}
      {/* Hero's background color */}
      <svg
        className='absolute inset-0 w-full h-full'
        viewBox='0 0 1 1'
        preserveAspectRatio='none'
      >
        <defs>
          <filter id='gooey' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation='12'
              result='blur'
            />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values='1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -9'
              result='goo'
            />
          </filter>
        </defs>

        <path
          ref={pathRef}
          fill='#f8f4eb' // same color as Hero
          filter='url(#gooey)'
        />
      </svg>
      {/* Section 2 background color */}
      <div className='absolute inset-0 bg-amber-600 translate-y-1/2' />
    </div>
  );
}
