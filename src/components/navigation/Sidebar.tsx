import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  School,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'teacher', 'parent', 'student'] },
  { name: 'Estudiantes', href: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
  { name: 'Mi Perfil', href: '/dashboard/profile', icon: User, roles: ['student', 'parent'] },
  { name: 'Mis Hijos', href: '/dashboard/children', icon: School, roles: ['parent'] },
  { name: 'Académico', href: '/dashboard/academic', icon: BookOpen, roles: ['admin', 'teacher', 'student', 'parent'] },
  { name: 'Asistencia', href: '/dashboard/attendance', icon: GraduationCap, roles: ['admin', 'teacher'] },
  { name: 'Mensajes', href: '/dashboard/messages', icon: MessageCircle, roles: ['admin', 'teacher', 'parent', 'student'] },
  { name: 'Calendario', href: '/dashboard/calendar', icon: Calendar, roles: ['admin', 'teacher', 'parent', 'student'] },
  { name: 'Boletines', href: '/dashboard/reports', icon: FileText, roles: ['admin', 'teacher', 'parent', 'student'] },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar({ isOpen, onToggle, userRole }: SidebarProps) {
  const location = useLocation();
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              SGE
            </span>
          </motion.div>
        )}
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-6">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-blue-900 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-full bg-blue-900 dark:bg-blue-400"
                />
              )}
              
              <Icon size={20} />
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}