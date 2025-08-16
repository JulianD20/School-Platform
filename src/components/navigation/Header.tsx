import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onToggleSidebar: () => void;
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Administrador',
      teacher: 'Docente',
      parent: 'Padre de Familia',
      student: 'Estudiante',
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sistema de Gestión Escolar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getRoleName(user.role)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          >
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </motion.button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="text-white" size={18} />
              )}
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}