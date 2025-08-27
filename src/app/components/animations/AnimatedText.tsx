"use client"

import { useRef, useEffect, useState, ReactNode } from 'react';
import { useIsMobile, useReducedMotion } from './hooks';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export default function AnimatedText({ 
  children, 
  delay = 0, 
  className = "",
  duration = 0.6
}: AnimatedTextProps) {
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
        rootMargin: isMobile ? "0px 0px -30px 0px" : 
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
        className={`${className} transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    );
  }

  const responsiveDuration = isMobile ? duration * 0.5 : isTablet ? duration * 0.7 : duration;

  return (
    <div
      ref={ref}
      className={`${className} transition-all ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : `opacity-0 ${
              isMobile ? 'translate-y-2' : 
              isTablet ? 'translate-y-4' : 
              'translate-y-6'
            } scale-95`
      } hover:scale-105`}
      style={{
        transitionDuration: `${responsiveDuration * 1000}ms`
      }}
    >
      {children}
    </div>
  );
}
