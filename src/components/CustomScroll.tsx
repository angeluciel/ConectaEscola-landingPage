'use client';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export function CustomScroll() {
  const hotzoneEnter = () => {
    gsap.to('#hotTrigger', {
      scaleX: 1,
      duration: 0.22,
      ease: 'power3.in',
    });
  };
  const hotzoneLeave = () => {
    gsap.to('#hotTrigger', {
      scaleX: 0,
      duration: 0.22,
      ease: 'circle.in',
    });
  };

  return (
    <div
      className='fixed z-999 w-[25dvw] hidden md:block h-dvh top-0 right-0 bottom-0 bg-emerald-500/10'
      onMouseEnter={hotzoneEnter}
      onMouseLeave={hotzoneLeave}
    >
      <div className='h-full absolute w-5 right-0 top-0 group/track'>
        <div className='h-full bg-sky-500/25 w-4 absolute right-0 top-0 bottom-0 transition-all duration-150 opacity-0 group-hover/track:opacity-100'></div>
      </div>
      <div
        className='h-12 w-2 scale-x-0 origin-center absolute right-1 top-6 bg-sky-500/50 rounded-sm transition-transform duration-100 ease-in'
        id='hotTrigger'
      ></div>
    </div>
  );
}
