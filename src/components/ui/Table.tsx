import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-800', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableHeaderProps) {
  return (
    <tbody className={cn('bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  const RowComponent = onClick ? motion.tr : 'tr';
  
  return (
    <RowComponent
      className={cn(
        'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...(onClick ? { whileHover: { scale: 1.01 } } : {})}
    >
      {children}
    </RowComponent>
  );
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white', className)}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className }: TableCellProps) {
  return (
    <th className={cn('px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}