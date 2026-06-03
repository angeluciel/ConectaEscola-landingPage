import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type AnimatedPresenceProps = {
  show: boolean;
  children: React.ReactNode;
  onExitComplete?: () => void;
};

export function AnimatedPresence({
  show,
  children,
  onExitComplete,
}: AnimatedPresenceProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (show) setShouldRender(true);
  }, [show]);

  useGSAP(
    () => {
      const el = container.current;
      if (!el) return;

      gsap.killTweensOf(el);

      if (show) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      } else {
        gsap.to(el, {
          opacity: 0,
          y: 24,
          duration: 0.25,
          ease: 'power3.in',
          onComplete: () => {
            setShouldRender(false);
            onExitComplete?.();
          },
        });
      }
    },
    { dependencies: [show], scope: container },
  );

  if (!shouldRender) return null;

  return (
    <div ref={container} className='fixed inset-0 z-9999'>
      {children}
    </div>
  );
}
