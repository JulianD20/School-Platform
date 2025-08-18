import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, Calendar } from 'lucide-react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export function StudentAcademicPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAcademicData();
  }, []);

  const loadAcademicData = async () => {
    setIsLoading(true);
    try {
      const [subjectsData, gradesData] = await Promise.all([
        academicService.getSubjects(),
        academicService.getGradesByStudent('1'), // Current student
      ]);
      setSubjects(subjectsData);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading academic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'warning';
    return 'danger';
  };

  const calculateSubjectAverage = (subjectId: string) => {
    const subjectGrades = grades.filter(grade => grade.subjectId === subjectId);
    if (subjectGrades.length === 0) return 0;
    
    const total = subjectGrades.reduce((sum, grade) => sum + (grade.value / grade.maxValue) * 10, 0);
    return (total / subjectGrades.length).toFixed(1);
  };

  const calculateOverallAverage = () => {
    if (grades.length === 0) return '0.0';
    
    const total = grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue) * 10, 0);
    return (total / grades.length).toFixed(1);
  };

  const performanceData = subjects.map(subject => ({
    subject: subject.name,
    A: parseFloat(calculateSubjectAverage(subject.id)),
    fullMark: 10
  }));

  const monthlyProgress = [
    { month: 'Ene', average: 8.2 },
    { month: 'Feb', average: 8.4 },
    { month: 'Mar', average: 8.5 },
    { month: 'Abr', average: 8.3 },
    { month: 'May', average: 8.6 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mi Rendimiento Académico
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Consulta tus calificaciones y progreso académico
          </p>
        </div>
      </motion.div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Promedio General"
          value={calculateOverallAverage()}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Materias"
          value={subjects.length}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Calificaciones"
          value={grades.length}
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
          transition={{ delay: 0.1 }}
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

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>
      </div>

      {/* Subjects Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mis Materias
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject, index) => {
                const average = calculateSubjectAverage(subject.id);
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
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            averageNum >= 9 ? 'bg-green-500' :
                            averageNum >= 8 ? 'bg-blue-500' :
                            averageNum >= 7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(averageNum / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Grades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mis Calificaciones
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
                {grades.map((grade, index) => (
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