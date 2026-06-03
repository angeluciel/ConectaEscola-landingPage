'use client';

import { useState, useEffect } from 'react';
import { AnimatedPresence } from './providers/AnimatePresence';

interface PreloaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

export default function Preloader({
  children,
  minLoadTime = 800,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const initLoading = async () => {
      const start = Temporal.Now.instant();

      const videoPromises = Array.from(document.querySelectorAll('video')).map(
        (video) => {
          const v = video as HTMLVideoElement;
          return new Promise<void>((resolve) => {
            if (v.readyState >= 3) {
              resolve();
              return;
            }

            const onReady = () => resolve();
            v.addEventListener('canplaythrough', onReady, { once: true });
            v.addEventListener('error', onReady, { once: true });

            if (v.paused && v.readyState < 3) v.load();
          });
        },
      );

      await Promise.all(videoPromises);

      const elapsed = Temporal.Now.instant().since(start).milliseconds;
      if (elapsed < minLoadTime) {
        await new Promise((r) => setTimeout(r, minLoadTime - elapsed));
      }

      setIsLoading(false);
    };

    timeout = setTimeout(initLoading, 50);

    return () => clearTimeout(timeout);
  }, [minLoadTime]);

  return (
    <>
      <AnimatedPresence show={isLoading}>
        <div className='flex-center absolute z-9999 h-full w-dvw overflow-hidden bg-amber-100'>
          <div className='loading-body'>
            <div className='loading-dots' />
            <div className='loading-dots' />
            <div className='loading-dots' />
          </div>
        </div>
      </AnimatedPresence>
      {children}
    </>
  );
}
