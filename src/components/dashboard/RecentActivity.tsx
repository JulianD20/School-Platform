import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, BookOpen, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ActivityItem {
  id: string;
  type: 'student' | 'grade' | 'message' | 'event';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'student',
    title: 'Nuevo estudiante registrado',
    description: 'Diego Martínez fue agregado al sistema',
    timestamp: '2024-01-15 10:30:00',
    user: 'María González',
  },
  {
    id: '2',
    type: 'grade',
    title: 'Calificación registrada',
    description: 'Nota de Matemáticas para Sofia García',
    timestamp: '2024-01-15 09:15:00',
    user: 'Carlos Rodríguez',
  },
  {
    id: '3',
    type: 'message',
    title: 'Mensaje enviado',
    description: 'Comunicado sobre reunión de padres',
    timestamp: '2024-01-15 08:45:00',
    user: 'María González',
  },
  {
    id: '4',
    type: 'event',
    title: 'Evento creado',
    description: 'Examen de Historia programado',
    timestamp: '2024-01-14 16:20:00',
    user: 'Carlos Rodríguez',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'student':
      return User;
    case 'grade':
      return BookOpen;
    case 'message':
      return MessageCircle;
    case 'event':
      return Calendar;
    default:
      return Clock;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'student':
      return 'info';
    case 'grade':
      return 'success';
    case 'message':
      return 'warning';
    case 'event':
      return 'default';
    default:
      return 'default';
  }
};

export function RecentActivity({ activities = mockActivities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Actividad Reciente
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  color === 'info' ? 'bg-blue-100 text-blue-600' :
                  color === 'success' ? 'bg-green-100 text-green-600' :
                  color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                } dark:bg-opacity-20`}>
                  <Icon size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.user && (
                      <Badge variant={color as any} size="sm">
                        {activity.user}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}