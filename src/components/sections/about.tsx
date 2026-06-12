import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  useGSAP(() => {
    gsap.to('#box', {
      xPercent: 90,
      scrollTrigger: {
        trigger: '#box',
        start: 'top top',
        end: '+=2000',
        markers: true,
        scrub: true,
      },
    });
  }, []);

  return (
    <section className='relative h-500 bg-zinc-900 w-full py-12 px-6'>
      <div className='sticky top-0 p-4 rounded-lg' id='box'>
        <div className='bg-zinc-800 w-fit p-4 rounded-lg'>alo</div>
      </div>
    </section>
  );
}
