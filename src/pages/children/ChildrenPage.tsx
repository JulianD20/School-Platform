import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Calendar, MessageCircle, Eye, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
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

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  dateOfBirth: string;
  overallGrade: number;
  attendance: number;
  behavior: 'Excelente' | 'Bueno' | 'Regular' | 'Necesita Mejorar';
  subjects: {
    name: string;
    grade: number;
    teacher: string;
  }[];
  recentGrades: {
    subject: string;
    grade: number;
    date: string;
    type: string;
  }[];
  upcomingEvents: {
    title: string;
    date: string;
    type: string;
  }[];
}

const mockChildren: Child[] = [
  {
    id: '1',
    firstName: 'Diego',
    lastName: 'Martínez',
    grade: '10A',
    dateOfBirth: '2008-05-15',
    overallGrade: 8.5,
    attendance: 94,
    behavior: 'Excelente',
    subjects: [
      { name: 'Matemáticas', grade: 8.5, teacher: 'Prof. Rodríguez' },
      { name: 'Historia', grade: 9.0, teacher: 'Prof. García' },
      { name: 'Biología', grade: 8.2, teacher: 'Prof. Torres' },
      { name: 'Química', grade: 7.9, teacher: 'Prof. López' },
      { name: 'Física', grade: 8.1, teacher: 'Prof. Morales' },
      { name: 'Literatura', grade: 8.7, teacher: 'Prof. Herrera' },
    ],
    recentGrades: [
      { subject: 'Matemáticas', grade: 9.0, date: '2024-01-15', type: 'Examen' },
      { subject: 'Historia', grade: 8.5, date: '2024-01-14', type: 'Ensayo' },
      { subject: 'Biología', grade: 8.8, date: '2024-01-13', type: 'Laboratorio' },
    ],
    upcomingEvents: [
      { title: 'Examen de Matemáticas', date: '2024-01-20', type: 'exam' },
      { title: 'Entrega de proyecto de Historia', date: '2024-01-22', type: 'assignment' },
      { title: 'Reunión de padres', date: '2024-01-25', type: 'meeting' },
    ],
  },
  {
    id: '2',
    firstName: 'Sofia',
    lastName: 'Martínez',
    grade: '8B',
    dateOfBirth: '2010-08-22',
    overallGrade: 9.2,
    attendance: 98,
    behavior: 'Excelente',
    subjects: [
      { name: 'Matemáticas', grade: 9.5, teacher: 'Prof. Jiménez' },
      { name: 'Ciencias', grade: 9.0, teacher: 'Prof. Vargas' },
      { name: 'Español', grade: 9.2, teacher: 'Prof. Castro' },
      { name: 'Inglés', grade: 8.8, teacher: 'Prof. Smith' },
      { name: 'Sociales', grade: 9.1, teacher: 'Prof. Ruiz' },
    ],
    recentGrades: [
      { subject: 'Matemáticas', grade: 9.5, date: '2024-01-15', type: 'Quiz' },
      { subject: 'Ciencias', grade: 9.0, date: '2024-01-14', type: 'Proyecto' },
      { subject: 'Español', grade: 9.3, date: '2024-01-13', type: 'Composición' },
    ],
    upcomingEvents: [
      { title: 'Feria de Ciencias', date: '2024-01-21', type: 'event' },
      { title: 'Examen de Inglés', date: '2024-01-23', type: 'exam' },
    ],
  },
];

export function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChildren(mockChildren);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (child: Child) => {
    setSelectedChild(child);
    setIsDetailModalOpen(true);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'text-green-600 dark:text-green-400';
    if (grade >= 8) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'Excelente':
        return 'success';
      case 'Bueno':
        return 'info';
      case 'Regular':
        return 'warning';
      case 'Necesita Mejorar':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'text-red-600 dark:text-red-400';
      case 'assignment':
        return 'text-blue-600 dark:text-blue-400';
      case 'meeting':
        return 'text-purple-600 dark:text-purple-400';
      case 'event':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalChildren = children.length;
  const averageGrade = children.reduce((sum, child) => sum + child.overallGrade, 0) / totalChildren;
  const averageAttendance = children.reduce((sum, child) => sum + child.attendance, 0) / totalChildren;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mis Hijos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Seguimiento académico y progreso de tus hijos
          </p>
        </div>
        <Button>
          <MessageCircle size={20} className="mr-2" />
          Contactar Docente
        </Button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Hijos"
          value={totalChildren}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Promedio General"
          value={averageGrade.toFixed(1)}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Asistencia Promedio"
          value={`${averageAttendance.toFixed(0)}%`}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {child.firstName[0]}{child.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Grado {child.grade}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(child)}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Academic Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getGradeColor(child.overallGrade)}`}>
                        {child.overallGrade.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Promedio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {child.attendance}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Asistencia</p>
                    </div>
                    <div className="text-center">
                      <Badge variant={getBehaviorColor(child.behavior) as any}>
                        {child.behavior}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comportamiento</p>
                    </div>
                  </div>

                  {/* Recent Grades */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Calificaciones Recientes
                    </h4>
                    <div className="space-y-2">
                      {child.recentGrades.slice(0, 3).map((grade, gradeIndex) => (
                        <div key={gradeIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {grade.subject} ({grade.type})
                          </span>
                          <span className={`font-semibold ${getGradeColor(grade.grade)}`}>
                            {grade.grade.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Próximos Eventos
                    </h4>
                    <div className="space-y-2">
                      {child.upcomingEvents.slice(0, 2).map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {event.title}
                          </span>
                          <span className={`font-medium ${getEventTypeColor(event.type)}`}>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Child Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}
        size="xl"
      >
        {selectedChild && (
          <div className="space-y-6">
            {/* Child Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-xl">
                    {selectedChild.firstName[0]}{selectedChild.lastName[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedChild.firstName} {selectedChild.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Grado {selectedChild.grade}</p>
              </div>
              
              <div className="text-center">
                <p className={`text-3xl font-bold ${getGradeColor(selectedChild.overallGrade)}`}>
                  {selectedChild.overallGrade.toFixed(1)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Promedio General</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedChild.attendance}%
                </p>
                <p className="text-gray-600 dark:text-gray-400">Asistencia</p>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Calificaciones por Materia
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedChild.subjects.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.teacher}
                        </p>
                      </div>
                      <span className={`text-xl font-bold ${getGradeColor(subject.grade)}`}>
                        {subject.grade.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Calificaciones Recientes
                </h4>
                <div className="space-y-3">
                  {selectedChild.recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {grade.subject}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {grade.type} - {new Date(grade.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                        {grade.grade.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Próximos Eventos
                </h4>
                <div className="space-y-3">
                  {selectedChild.upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className={`text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}