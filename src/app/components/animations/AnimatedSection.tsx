"use client"

import { useRef, useEffect, useState, ReactNode } from 'react';
import { useIsMobile, useReducedMotion } from './hooks';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  delay?: number;
  className?: string;
}

export default function AnimatedSection({ 
  children, 
  id, 
  delay = 0, 
  className = "" 
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile, isTablet } = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const adjustedDelay = isMobile ? delay * 0.1 : isTablet ? delay * 0.3 : delay;
          
          setTimeout(() => {
            setIsVisible(true);
          }, adjustedDelay);
          
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: isMobile ? "0px 0px -50px 0px" : 
                   isTablet ? "-50px 0px -100px 0px" : 
                   "-100px 0px -100px 0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, isMobile, isTablet]);

  // Movimento reduzido
  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        id={id}
        className={`${className} transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : `opacity-0 ${
              isMobile ? 'translate-y-5' : 
              isTablet ? 'translate-y-8' : 
              'translate-y-12'
            }`
      }`}
    >
      {children}
    </div>
  );
}
