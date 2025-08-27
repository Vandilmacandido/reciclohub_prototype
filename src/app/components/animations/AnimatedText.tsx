"use client"

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
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
  const ref = useRef(null);
  const { isMobile, isTablet } = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const isInView = useInView(ref, { 
    once: true, 
    // Inicia animação assim que entra no viewport para mobile
    margin: isMobile ? "0px 0px -30px 0px" : isTablet ? "-50px 0px -100px 0px" : "-100px 0px -100px 0px"
  });

  // Movimento reduzido
  if (prefersReducedMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: isMobile ? 10 : isTablet ? 20 : 30, scale: 0.99 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1 
      } : { 
        opacity: 0, 
        y: isMobile ? 10 : isTablet ? 20 : 30, 
        scale: 0.99 
      }}
      transition={{
        // Delays mínimos para mobile
        duration: isMobile ? duration * 0.5 : isTablet ? duration * 0.7 : duration,
        delay: isMobile ? (delay * 0.1) / 1000 : isTablet ? (delay * 0.3) / 1000 : delay / 1000,
        ease: isMobile ? [0.25, 0.1, 0.25, 1] : [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: isMobile ? 280 : isTablet ? 200 : 150,
        damping: isMobile ? 35 : isTablet ? 28 : 22
      }}
      whileHover={!isMobile ? {
        scale: isTablet ? 1.01 : 1.02,
        transition: { duration: 0.15, ease: "easeOut" }
      } : {}}
    >
      {children}
    </motion.div>
  );
}
