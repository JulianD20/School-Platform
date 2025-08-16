import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, MessageCircle, Calendar, BookOpen, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const myClassesData = [
    { subject: 'Matemáticas 10A', students: 28, average: 8.5 },
    { subject: 'Matemáticas 10B', students: 25, average: 8.2 },
    { subject: 'Álgebra 11A', students: 22, average: 7.9 },
  ];

  const attendanceData = [
    { day: 'Lun', present: 23, absent: 2 },
    { day: 'Mar', present: 24, absent: 1 },
    { day: 'Mié', present: 25, absent: 0 },
    { day: 'Jue', present: 22, absent: 3 },
    { day: 'Vie', present: 24, absent: 1 },
  ];

  const upcomingClasses = [
    { time: '08:00', subject: 'Matemáticas 10A', room: 'Aula 201' },
    { time: '10:00', subject: 'Álgebra 11A', room: 'Aula 203' },
    { time: '14:00', subject: 'Matemáticas 10B', room: 'Aula 201' },
  ];

  const pendingTasks = [
    { task: 'Revisar exámenes de Matemáticas 10A', priority: 'high', due: 'Hoy' },
    { task: 'Preparar material para Álgebra 11A', priority: 'medium', due: 'Mañana' },
    { task: 'Evaluar proyectos finales', priority: 'low', due: 'Esta semana' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel Docente
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona tus clases y estudiantes
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Mis Estudiantes"
          value={75}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Clases Hoy"
          value={3}
          icon={BookOpen}
          color="green"
        />
        <StatsCard
          title="Tareas Pendientes"
          value={8}
          icon={ClipboardList}
          color="yellow"
        />
        <StatsCard
          title="Mensajes"
          value={12}
          icon={MessageCircle}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mis Clases
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myClassesData.map((classItem, index) => (
                  <motion.div
                    key={classItem.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {classItem.subject}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {classItem.students} estudiantes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {classItem.average}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Promedio
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Asistencia de la Semana
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#1e3a8a" name="Presentes" />
                  <Bar dataKey="absent" fill="#ef4444" name="Ausentes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions
            userRole="teacher"
            onAction={(action) => console.log('Action:', action)}
          />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Horario de Hoy
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((classItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {classItem.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {classItem.time} - {classItem.room}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tareas Pendientes
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {task.task}
                      </p>
                      <Badge
                        variant={
                          task.priority === 'high' ? 'danger' :
                          task.priority === 'medium' ? 'warning' : 'default'
                        }
                        size="sm"
                      >
                        {task.priority === 'high' ? 'Alta' :
                         task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Vence: {task.due}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}