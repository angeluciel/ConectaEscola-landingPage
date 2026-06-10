'use client';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export type LinkType = {
  name: string;
  href: string;
};

interface HeaderProps {
  links: LinkType[];
}

gsap.registerPlugin(useGSAP);

export default function HeroHeader({ links }: HeaderProps) {
  const [show, setShow] = useState(true);
  const lenis = useLenis();

  const headerContainerRef = useRef<HTMLHeadingElement | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const unsubscribe = lenis.on('scroll', ({ scroll }) => {
      const delta = scroll - lastScrollY.current;
      lastScrollY.current = scroll;

      if (delta === 0) return;

      setShow((current) => {
        const shouldShow = delta < 0;
        return current === shouldShow ? current : shouldShow;
      });
    });

    return unsubscribe;
  }, [lenis]);

  useGSAP(() => {
    gsap.to(headerContainerRef.current, {
      y: show ? 0 : -100,
      opacity: show ? 1 : 0,
      duration: 0.375,
    });
  }, [show]);

  return (
    <header
      ref={headerContainerRef}
      className='flex justify-start md:justify-between items-top w-dvw fixed z-20 top-0 left-0 md:px-[clamp(4rem,8vw+4rem,8rem)]'
    >
      <h1 className='font-bold uppercase text-display text-amber-100 font-heading-serif'>
        conecta
        <span className='font-black normal-case tracking-widest text-heading'>
          escola
        </span>
      </h1>
      <div className='hidden md:flex text-body pt-2 gap-2 lg:gap-6 items-center lg:items-top font-sans font-medium'>
        {links.map((link) => (
          <Link key={link.href + link.name} href={link.href} title={link.name}>
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
