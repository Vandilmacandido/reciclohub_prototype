"use client"

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
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
  const ref = useRef(null);
  const { isMobile, isTablet } = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const isInView = useInView(ref, { 
    once: true, 
    // Inicia a animação assim que entra no viewport para mobile
    margin: isMobile ? "0px 0px -50px 0px" : isTablet ? "-50px 0px -100px 0px" : "-100px 0px -150px 0px"
  });

  // Animação simplificada para movimento reduzido
  if (prefersReducedMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: (index * 100) / 1000 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        y: isMobile ? 15 : isTablet ? 25 : 40, 
        scale: isMobile ? 0.98 : isTablet ? 0.96 : 0.9,
        rotateX: isMobile ? 2 : isTablet ? 4 : 15 
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateX: 0 
      } : { 
        opacity: 0, 
        y: isMobile ? 15 : isTablet ? 25 : 40, 
        scale: isMobile ? 0.98 : isTablet ? 0.96 : 0.9,
        rotateX: isMobile ? 2 : isTablet ? 4 : 15 
      }}
      transition={{
        // Animações otimizadas para mobile - delays mínimos
        duration: isMobile ? 0.35 : isTablet ? 0.5 : 0.7,
        delay: (delay + index * (isMobile ? 20 : isTablet ? 40 : 150)) / 1000,
        ease: isMobile ? [0.25, 0.1, 0.25, 1] : [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: isMobile ? 250 : isTablet ? 180 : 140,
        damping: isMobile ? 35 : isTablet ? 30 : 25
      }}
      whileHover={!isMobile ? {
        scale: isTablet ? 1.03 : 1.05,
        y: isTablet ? -4 : -8,
        rotateX: isTablet ? -1 : -2,
        rotateY: isTablet ? 1 : 2,
        transition: { 
          duration: 0.2, 
          ease: [0.25, 0.1, 0.25, 1],
          type: "spring",
          stiffness: 200,
          damping: 25
        }
      } : {}}
      whileTap={{
        scale: isMobile ? 0.99 : 0.98,
        transition: { duration: 0.06 }
      }}
      style={{
        transformPerspective: 1000,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
}
