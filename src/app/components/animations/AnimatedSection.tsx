"use client"

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
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
  const ref = useRef(null);
  const { isMobile, isTablet } = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const isInView = useInView(ref, { 
    once: true, 
    // Inicia a animação assim que entra no viewport para mobile, mais tarde para desktop
    margin: isMobile ? "0px 0px -100px 0px" : isTablet ? "-100px 0px -200px 0px" : "-200px 0px -200px 0px"
  });

  // Se prefere movimento reduzido, apenas fade simples
  if (prefersReducedMotion) {
    return (
      <motion.div
        ref={ref}
        id={id}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: isMobile ? 20 : isTablet ? 30 : 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 20 : isTablet ? 30 : 60 }}
      transition={{
        // Animações muito mais rápidas para mobile
        duration: isMobile ? 0.4 : isTablet ? 0.6 : 0.8,
        delay: isMobile ? (delay * 0.1) / 1000 : isTablet ? (delay * 0.3) / 1000 : delay / 1000,
        ease: isMobile ? [0.25, 0.1, 0.25, 1] : [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: isMobile ? 300 : isTablet ? 200 : 160,
        damping: isMobile ? 40 : isTablet ? 35 : 28
      }}
    >
      {children}
    </motion.div>
  );
}
