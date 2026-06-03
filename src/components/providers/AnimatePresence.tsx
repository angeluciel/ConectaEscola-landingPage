import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type AnimatedPresenceProps = {
  show: boolean;
  children: React.ReactNode;
};

export function AnimatedPresence({ show, children }: AnimatedPresenceProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  useGSAP(
    () => {
      const el = container.current;
      if (!el) return;

      if (show) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          y: 24,
          duration: 0.25,
          ease: 'power3.in',
          onComplete: () => setShouldRender(false),
        });
      }
    },
    { dependencies: [show], scope: container },
  );

  if (!shouldRender) return null;

  return <div ref={container}>{children}</div>;
}
