'use client';
import HeroHeader, { LinkType } from '@/components/header';
import { Hero, About } from '@/components/sections';
import { useLenis } from 'lenis/react';
import { useState } from 'react';

export default function Home() {
  const [mock, setMock] = useState(0);

  useLenis(({ progress }) => {
    setMock(progress);
  })

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
        <About />
        <section className='relative h-[500dvh] w-full bg-amber-600 pt-12 px-4'>
          <div className='sticky top-0 h-screen flex items-start justify-start'>
          {mock}
          </div>
        </section>
      </main>
    </div>
  );
}
