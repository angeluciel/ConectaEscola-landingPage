import Link from 'next/link';

export type LinkType = {
  name: string;
  href: string;
};

interface HeaderProps {
  links: LinkType[];
}

export default function HeroHeader({ links }: HeaderProps) {
  return (
    <header className='flex justify-between items-top'>
      <h1 className='font-bold uppercase text-5xl text-amber-100 font-heading-serif'>
        conecta
        <span className='font-black normal-case tracking-widest text-2xl'>
          escola
        </span>
      </h1>
      <div className='flex text-lg gap-6 items-top font-sans'>
        {links.map((link) => (
          <Link key={link.href + link.name} href={link.href}>
            {link.name}
          </Link>
        ))}
        <Link href={`/contatos`}>Alunos</Link>
        <Link href={`/contatos`}>Professores</Link>
        <Link href={`/contatos`}>Pais</Link>
        <Link href={`/contatos`}>Sobre</Link>
        <Link href={`/contatos`}>Contato</Link>
      </div>
    </header>
  );
}
