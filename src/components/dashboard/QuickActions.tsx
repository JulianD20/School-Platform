import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';

interface QuickActionsProps {
  userRole: UserRole;
  onAction?: (action: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  roles: UserRole[];
}

const quickActions: QuickAction[] = [
  {
    id: 'add_student',
    label: 'Agregar Estudiante',
    icon: UserPlus,
    color: 'bg-blue-500 hover:bg-blue-600',
    roles: ['admin'],
  },
  {
    id: 'send_message',
    label: 'Enviar Mensaje',
    icon: MessageSquare,
    color: 'bg-green-500 hover:bg-green-600',
    roles: ['admin', 'teacher', 'parent'],
  },
  {
    id: 'add_event',
    label: 'Crear Evento',
    icon: Calendar,
    color: 'bg-purple-500 hover:bg-purple-600',
    roles: ['admin', 'teacher'],
  },
  {
    id: 'generate_report',
    label: 'Generar Reporte',
    icon: FileText,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    roles: ['admin', 'teacher'],
  },
];

export function QuickActions({ userRole, onAction }: QuickActionsProps) {
  const filteredActions = quickActions.filter(action =>
    action.roles.includes(userRole)
  );

  if (filteredActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Acciones Rápidas
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {filteredActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction?.(action.id)}
                className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2 text-sm font-medium`}
              >
                <Icon size={20} />
                <span>{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}