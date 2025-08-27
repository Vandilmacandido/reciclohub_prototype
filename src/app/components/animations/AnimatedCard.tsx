"use client"

import { useRef, useEffect, useState, ReactNode } from 'react';
import { useIsMobile, useReducedMotion } from './hooks';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  index?: number;
}

export default function AnimatedCard({ 
  children, 
  delay = 0, 
  className = "",
  index = 0
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile, isTablet } = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay escalonado baseado no prop delay + index
          const totalDelay = isMobile ? 
            (delay + index * 20) * 0.1 : 
            isTablet ? 
            (delay + index * 40) * 0.3 : 
            (delay + index * 150) * 1;
          
          setTimeout(() => {
            setIsVisible(true);
          }, totalDelay);
          
          observer.unobserve(entry.target);
        }
      },
      {
        // Inicia animação assim que entra no viewport
        rootMargin: isMobile ? "0px 0px -50px 0px" : 
                   isTablet ? "-50px 0px -100px 0px" : 
                   "-100px 0px -150px 0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, index, isMobile, isTablet]);

  // Movimento reduzido - apenas fade
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

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : `opacity-0 ${
              isMobile ? 'translate-y-4' : 
              isTablet ? 'translate-y-6' : 
              'translate-y-8'
            } scale-95`
      }`}
      style={{
        transitionDelay: isVisible ? '0ms' : '0ms'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
