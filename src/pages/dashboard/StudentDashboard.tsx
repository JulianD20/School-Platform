import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MessageCircle, TrendingUp, Award, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function StudentDashboard() {
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

  const currentGrades = [
    { subject: 'Matemáticas', grade: 8.5, credits: 4 },
    { subject: 'Historia', grade: 9.0, credits: 3 },
    { subject: 'Biología', grade: 8.2, credits: 3 },
    { subject: 'Química', grade: 7.9, credits: 3 },
    { subject: 'Física', grade: 8.1, credits: 3 },
    { subject: 'Literatura', grade: 8.7, credits: 2 },
  ];

  const performanceData = [
    { subject: 'Matemáticas', A: 8.5, fullMark: 10 },
    { subject: 'Historia', A: 9.0, fullMark: 10 },
    { subject: 'Biología', A: 8.2, fullMark: 10 },
    { subject: 'Química', A: 7.9, fullMark: 10 },
    { subject: 'Física', A: 8.1, fullMark: 10 },
    { subject: 'Literatura', A: 8.7, fullMark: 10 },
  ];

  const monthlyProgress = [
    { month: 'Ene', average: 8.2 },
    { month: 'Feb', average: 8.4 },
    { month: 'Mar', average: 8.5 },
    { month: 'Abr', average: 8.3 },
    { month: 'May', average: 8.6 },
  ];

  const upcomingAssignments = [
    { subject: 'Matemáticas', assignment: 'Examen Capítulo 5', due: '2024-01-20', priority: 'high' },
    { subject: 'Historia', assignment: 'Ensayo sobre la Revolución', due: '2024-01-22', priority: 'medium' },
    { subject: 'Biología', assignment: 'Laboratorio de Células', due: '2024-01-25', priority: 'low' },
  ];

  const todaySchedule = [
    { time: '08:00', subject: 'Matemáticas', room: 'Aula 201', teacher: 'Prof. Rodríguez' },
    { time: '10:00', subject: 'Historia', room: 'Aula 105', teacher: 'Prof. García' },
    { time: '14:00', subject: 'Biología', room: 'Lab 1', teacher: 'Prof. Torres' },
  ];

  const calculateGPA = () => {
    const totalPoints = currentGrades.reduce((sum, grade) => sum + (grade.grade * grade.credits), 0);
    const totalCredits = currentGrades.reduce((sum, grade) => sum + grade.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mi Panel Estudiantil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenido Diego, aquí está tu progreso académico
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Promedio General"
          value={calculateGPA()}
          icon={TrendingUp}
          color="green"
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatsCard
          title="Materias"
          value={currentGrades.length}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Tareas Pendientes"
          value={upcomingAssignments.length}
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          title="Mensajes"
          value={3}
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
                Progreso Mensual
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProgress}>
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
                Rendimiento por Materia
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar
                    name="Calificación"
                    dataKey="A"
                    stroke="#1e3a8a"
                    fill="#1e3a8a"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mis Calificaciones Actuales
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentGrades.map((grade, index) => (
                  <motion.div
                    key={grade.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {grade.subject}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {grade.credits} créditos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {grade.grade}
                      </p>
                      <Badge
                        variant={
                          grade.grade >= 9 ? 'success' :
                          grade.grade >= 8 ? 'info' :
                          grade.grade >= 7 ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {grade.grade >= 9 ? 'Excelente' :
                         grade.grade >= 8 ? 'Bueno' :
                         grade.grade >= 7 ? 'Regular' : 'Mejorar'}
                      </Badge>
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
                Horario de Hoy
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((classItem, index) => (
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
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {classItem.teacher}
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
                Tareas Próximas
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAssignments.map((assignment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.assignment}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {assignment.subject}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.priority === 'high' ? 'danger' :
                          assignment.priority === 'medium' ? 'warning' : 'success'
                        }
                        size="sm"
                      >
                        {assignment.priority === 'high' ? 'Urgente' :
                         assignment.priority === 'medium' ? 'Medio' : 'Normal'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Fecha: {new Date(assignment.due).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Award className="text-yellow-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                Logros
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Award className="text-yellow-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Mejor Promedio del Mes
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Mayo 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Award className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Asistencia Perfecta
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Abril 2024
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}