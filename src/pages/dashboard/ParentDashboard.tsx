import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Calendar, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function ParentDashboard() {
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

  const children = [
    {
      id: '1',
      name: 'Diego Martínez',
      grade: '10A',
      avatar: null,
      overallGrade: 8.5,
      attendance: 94,
    },
  ];

  const gradesData = [
    { subject: 'Matemáticas', grade: 8.5, trend: 'up' },
    { subject: 'Historia', grade: 9.0, trend: 'up' },
    { subject: 'Biología', grade: 8.2, trend: 'stable' },
    { subject: 'Química', grade: 7.9, trend: 'down' },
    { subject: 'Física', grade: 8.1, trend: 'up' },
  ];

  const monthlyGrades = [
    { month: 'Ene', average: 8.2 },
    { month: 'Feb', average: 8.4 },
    { month: 'Mar', average: 8.5 },
    { month: 'Abr', average: 8.3 },
    { month: 'May', average: 8.6 },
  ];

  const attendanceData = [
    { week: 'Sem 1', present: 5, absent: 0 },
    { week: 'Sem 2', present: 4, absent: 1 },
    { week: 'Sem 3', present: 5, absent: 0 },
    { week: 'Sem 4', present: 5, absent: 0 },
  ];

  const upcomingEvents = [
    { date: '2024-01-20', event: 'Examen de Matemáticas', type: 'exam' },
    { date: '2024-01-22', event: 'Reunión de padres', type: 'meeting' },
    { date: '2024-01-25', event: 'Entrega de proyecto de Historia', type: 'assignment' },
  ];

  const recentMessages = [
    { from: 'Carlos Rodríguez', subject: 'Progreso en Matemáticas', date: '2024-01-15' },
    { from: 'María González', subject: 'Reunión de padres', date: '2024-01-14' },
    { from: 'Ana Torres', subject: 'Actividad extracurricular', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Padres
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Seguimiento académico de sus hijos
        </p>
      </motion.div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <User className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {child.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Grado {child.grade}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Promedio General"
          value="8.5"
          icon={BookOpen}
          color="green"
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Asistencia"
          value="94%"
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Mensajes"
          value={5}
          icon={MessageCircle}
          color="purple"
        />
        <StatsCard
          title="Próximos Eventos"
          value={3}
          icon={Calendar}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Evolución de Calificaciones
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calificaciones por Materia
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradesData.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen size={20} className="text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {subject.subject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subject.grade}
                      </span>
                      <div className={`text-sm ${
                        subject.trend === 'up' ? 'text-green-600' :
                        subject.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {subject.trend === 'up' ? '↗' :
                         subject.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Próximos Eventos
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/20' :
                      event.type === 'meeting' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`}>
                      <Calendar className={`${
                        event.type === 'exam' ? 'text-red-600 dark:text-red-400' :
                        event.type === 'meeting' ? 'text-blue-600 dark:text-blue-400' :
                        'text-green-600 dark:text-green-400'
                      }`} size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.event}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
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
                Mensajes Recientes
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      De: {message.from}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(message.date).toLocaleDateString()}
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