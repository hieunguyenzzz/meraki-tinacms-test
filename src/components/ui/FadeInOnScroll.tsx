'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
}

export default function FadeInOnScroll({
  children,
  className = '',
}: FadeInOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.unobserve(element);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`${className} ${isVisible
          ? 'animate__animated animate__fadeInUp'
          : 'opacity-0 motion-reduce:opacity-100'
        }`}
    >
      {children}
    </div>
  );
}
