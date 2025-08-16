import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const CardComponent = onClick ? motion.div : 'div';
  
  return (
    <CardComponent
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
        hover && 'transition-shadow hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...(onClick ? {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 }
      } : {})}
    >
      {children}
    </CardComponent>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}