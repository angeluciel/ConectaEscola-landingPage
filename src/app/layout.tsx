import type { Metadata } from 'next';
import {
  Geist_Mono,
  Instrument_Serif,
  Instrument_Sans,
} from 'next/font/google';
import './globals.css';
import 'lenis/dist/lenis.css';
import { LenisProvider } from '@/components/providers/LenisProvider';
import Preloader from '@/components/preLoader';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

export const headingFonts = Instrument_Serif({
  variable: '--font-heading-serif',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Conecta',
  description: 'Muito mais que um portal do aluno.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      style={{ overflow: 'clip'}}
      className={`lenis ${instrumentSans.variable} ${geistMono.variable} ${headingFonts.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <Preloader minLoadTime={1400}>
          <LenisProvider>{children}</LenisProvider>
        </Preloader>
      </body>
    </html>
  );
}
