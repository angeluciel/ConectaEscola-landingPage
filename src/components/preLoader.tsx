'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { useLenis } from 'lenis/react';
import { PreloaderContext } from './providers/PreloaderContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface PreloaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

interface OverlayProps {
  show: boolean;
  onExitComplete: () => void;
}

function PreloaderOverlay({ show, onExitComplete }: OverlayProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onExitCompleteRef = useRef(onExitComplete);

  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || show) return;

      gsap.killTweensOf(el);

      gsap.to(el, {
        yPercent: -100,
        duration: 0.67,
        ease: 'power1.in',
        onComplete: () => {
          setShouldRender(false);
          onExitCompleteRef.current();
        },
      });
    },
    { dependencies: [show], scope: containerRef },
  );

  if (!shouldRender) return null;

  return (
    <div ref={containerRef} className='fixed inset-0 z-50'>
      <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-amber-100'>
        <div className='loading-body'>
          <div className='loading-dots' />
          <div className='loading-dots' />
          <div className='loading-dots' />
        </div>
      </div>
    </div>
  );
}

export default function Preloader({
  children,
  minLoadTime = 800,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const registryRef = useRef<Promise<void>[]>([]);

  const lenis = useLenis();

  useEffect(() => {
    document.documentElement.style.overflow = 'clip';
  }, []);

  const registerResource = useCallback((promise: Promise<void>) => {
    registryRef.current.push(promise);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const ticket = setTimeout(async () => {
      const start = performance.now();

      const promises = [...registryRef.current];

      await Promise.all([
        Promise.all(promises),
        new Promise<void>((resolve) => setTimeout(resolve, minLoadTime)),
      ]);

      if (cancelled) return;
      setIsLoading(false);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(ticket);
    };
  }, [minLoadTime]);

  const handleExitComplete = useCallback(() => {
    document.documentElement.style.overflow = '';
    lenis?.start();
    setIsReady(true);
  }, [lenis]);

  return (
    <PreloaderContext.Provider value={{ isLoading, isReady, registerResource }}>
      <main>{children}</main>
      <PreloaderOverlay show={isLoading} onExitComplete={handleExitComplete} />
    </PreloaderContext.Provider>
  );
}
