import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    yellow: 'bg-yellow-500 text-yellow-600',
    red: 'bg-red-500 text-red-600',
    purple: 'bg-purple-500 text-purple-600',
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {value}
              </p>
              {trend && (
                <div className={`flex items-center mt-2 text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{trend.isPositive ? '↗' : '↘'}</span>
                  <span className="ml-1">{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color].split(' ')[0]}/10`}>
              <Icon className={colorClasses[color].split(' ')[1]} size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}