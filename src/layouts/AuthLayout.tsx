import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg')] bg-cover bg-center opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-full mb-4"
            >
              <GraduationCap size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-white text-sm opacity-90">
            © 2024 Sistema de Gestión Escolar
          </p>
        </div>
      </motion.div>
    </div>
  );
}