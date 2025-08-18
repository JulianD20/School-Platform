import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, User, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { academicService } from '../../services/academicService';
import { Subject, Grade } from '../../types';
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
  name: string;
  grade: string;
  subjects: Subject[];
  grades: Grade[];
}

export function ParentAcademicPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChildrenData();
  }, []);

  const loadChildrenData = async () => {
    setIsLoading(true);
    try {
      // Mock data for parent's children
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Diego Martínez',
          grade: '10A',
          subjects: await academicService.getSubjects(),
          grades: await academicService.getGradesByStudent('1'),
        }
      ];
      setChildren(mockChildren);
      if (mockChildren.length > 0) {
        setSelectedChild(mockChildren[0].id);
      }
    } catch (error) {
      console.error('Error loading children data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentChild = () => {
    return children.find(child => child.id === selectedChild);
  };

  const getGradeColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'warning';
    return 'danger';
  };

  const calculateSubjectAverage = (child: Child, subjectId: string) => {
    const subjectGrades = child.grades.filter(grade => grade.subjectId === subjectId);
    if (subjectGrades.length === 0) return 0;
    
    const total = subjectGrades.reduce((sum, grade) => sum + (grade.value / grade.maxValue) * 10, 0);
    return (total / subjectGrades.length).toFixed(1);
  };

  const calculateOverallAverage = (child: Child) => {
    if (child.grades.length === 0) return '0.0';
    
    const total = child.grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue) * 10, 0);
    return (total / child.grades.length).toFixed(1);
  };

  const currentChild = getCurrentChild();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentChild) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron datos académicos
        </p>
      </div>
    );
  }

  const subjectAverages = currentChild.subjects.map(subject => ({
    subject: subject.name,
    average: parseFloat(calculateSubjectAverage(currentChild, subject.id))
  }));

  const monthlyProgress = [
    { month: 'Ene', average: 8.2 },
    { month: 'Feb', average: 8.4 },
    { month: 'Mar', average: 8.5 },
    { month: 'Abr', average: 8.3 },
    { month: 'May', average: 8.6 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rendimiento Académico
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Seguimiento del progreso académico de tus hijos
          </p>
        </div>
        {children.length > 1 && (
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="mt-4 sm:mt-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.grade}
              </option>
            ))}
          </select>
        )}
      </motion.div>

      {/* Child Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentChild.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Grado {currentChild.grade}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Promedio General"
          value={calculateOverallAverage(currentChild)}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Materias"
          value={currentChild.subjects.length}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Calificaciones"
          value={currentChild.grades.length}
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Período Actual"
          value="2024-1"
          icon={Calendar}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Subject Averages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Promedios por Materia
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Subjects Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Materias de {currentChild.name}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentChild.subjects.map((subject, index) => {
                const average = calculateSubjectAverage(currentChild, subject.id);
                const averageNum = parseFloat(average);
                
                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Prof. {subject.teacherName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {subject.credits} créditos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {average}
                        </p>
                        <Badge 
                          variant={
                            averageNum >= 9 ? 'success' :
                            averageNum >= 8 ? 'info' :
                            averageNum >= 7 ? 'warning' : 'danger'
                          } 
                          size="sm"
                        >
                          {averageNum >= 9 ? 'Excelente' :
                           averageNum >= 8 ? 'Bueno' :
                           averageNum >= 7 ? 'Regular' : 'Mejorar'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Grades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Calificaciones Recientes
            </h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Materia</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Calificación</TableHeaderCell>
                  <TableHeaderCell>Fecha</TableHeaderCell>
                  <TableHeaderCell>Comentarios</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentChild.grades.slice(0, 10).map((grade, index) => (
                  <motion.tr
                    key={grade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {grade.subjectName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {grade.type === 'exam' ? 'Examen' :
                         grade.type === 'homework' ? 'Tarea' :
                         grade.type === 'quiz' ? 'Quiz' : 'Proyecto'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {grade.value}/{grade.maxValue}
                        </span>
                        <Badge variant={getGradeColor(grade.value, grade.maxValue)} size="sm">
                          {((grade.value / grade.maxValue) * 10).toFixed(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(grade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {grade.comments || '-'}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}