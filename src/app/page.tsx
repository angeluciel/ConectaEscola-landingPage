'use client';
import HeroHeader, { LinkType } from '@/components/header';
import Hero from '@/components/hero';
import { useLenis } from 'lenis/react';

export default function Home() {
  const l = useLenis()?.progress;

  const headerLinks: LinkType[] = [
    { name: 'Alunos', href: '/alunos' },
    { name: 'Professores', href: '/professores' },
    { name: 'Pais', href: '/pais' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-background font-sans w-dvw'>
      <HeroHeader links={headerLinks} />
      <main className='flex w-full flex-col items-center justify-between sm:items-start bg-black/20 relative'>
        <Hero />
        <section className='relative h-[500dvh] w-full bg-amber-600'>
          {l}
        </section>
      </main>
    </div>
  );
}
