'use client';

import { useState, useEffect } from 'react';
import { AnimatedPresence } from './providers/AnimatePresence';

interface PreloaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

function waitForVideo(video: HTMLVideoElement, timeoutMs = 5000) {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let done = false;
    // eslint-disable-next-line prefer-const
    let timeout: ReturnType<typeof setTimeout>;

    const finish = () => {
      if (done) return;
      done = true;

      clearTimeout(timeout);
      video.removeEventListener('loadeddata', finish);
      video.removeEventListener('canplay', finish);
      video.removeEventListener('error', finish);

      resolve();
    };

    video.addEventListener('loadeddata', finish);
    video.addEventListener('canplay', finish);
    video.addEventListener('error', finish);

    timeout = setTimeout(finish, timeoutMs);

    try {
      video.load();
    } catch {
      finish();
    }
  });
}

export default function Preloader({
  children,
  minLoadTime = 800,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let unlockTimeout: ReturnType<typeof setTimeout> | undefined;

    const html = document.documentElement;

    html.style.overflow = 'clip';

    const initLoading = async () => {
      const start = performance.now();

      const videos = Array.from(
        document.querySelectorAll('video'),
      ) as HTMLVideoElement[];

      await Promise.all(videos.map((video) => waitForVideo(video)));

      const elapsed = performance.now() - start;
      const remaining = minLoadTime - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (cancelled) return;

      setIsLoading(false);
    };

    // eslint-disable-next-line prefer-const
    timeout = setTimeout(initLoading, 50);

    return () => {
      cancelled = true;
      clearTimeout(timeout);

      if (unlockTimeout) clearTimeout(unlockTimeout);
    };
  }, [minLoadTime]);

  const handleExitComplete = () => {
    const html = document.documentElement;
  };

  //TODO: This FUCKING thing isnt working, fix this bullshit
  //      the preloader loads twice, and doesnt wait for the animation to end before allowing scroll

  return (
    <>
      <main>{children}</main>
      <AnimatedPresence show={isLoading} onExitComplete={handleExitComplete}>
        <div className='flex-center h-dvh w-dvw overflow-hidden bg-amber-100'>
          <div className='loading-body'>
            <div className='loading-dots' />
            <div className='loading-dots' />
            <div className='loading-dots' />
          </div>
        </div>
      </AnimatedPresence>
    </>
  );
}
