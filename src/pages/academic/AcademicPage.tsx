import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { GradeForm } from '../../components/forms/GradeForm';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { academicService } from '../../services/academicService';
import { Subject, Grade, GradeFormData } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function AcademicPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    loadAcademicData();
  }, []);

  const loadAcademicData = async () => {
    setIsLoading(true);
    try {
      const [subjectsData, gradesData] = await Promise.all([
        academicService.getSubjects(),
        academicService.getGradesByStudent('1'), // Mock student ID
      ]);
      setSubjects(subjectsData);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading academic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGrade = () => {
    setIsGradeModalOpen(true);
  };

  const handleSubmitGrade = async (data: GradeFormData) => {
    setIsFormLoading(true);
    try {
      await academicService.createGrade(data);
      setIsGradeModalOpen(false);
      loadAcademicData();
    } catch (error) {
      console.error('Error submitting grade:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const getGradeColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'warning';
    return 'danger';
  };

  const getGradeLabel = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 80) return 'Bueno';
    if (percentage >= 70) return 'Regular';
    return 'Necesita Mejorar';
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
            Módulo Académico
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de calificaciones y rendimiento académico
          </p>
        </div>
        <Button onClick={handleAddGrade} className="mt-4 sm:mt-0">
          <Plus size={20} className="mr-2" />
          Registrar Calificación
        </Button>
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
          title="Estudiantes"
          value={75}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Subjects Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Materias y Rendimiento
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
                          {subject.code} - {subject.grade}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Prof. {subject.teacherName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {average}
                        </p>
                        <Badge variant={getGradeColor(averageNum, 10)} size="sm">
                          {getGradeLabel(averageNum, 10)}
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

      {/* Recent Grades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
                {grades.map((grade, index) => (
                  <motion.tr
                    key={grade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {grade.subjectName}
                        </p>
                      </div>
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
                          {getGradeLabel(grade.value, grade.maxValue)}
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

      {/* Grade Form Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Registrar Nueva Calificación"
        size="lg"
      >
        <GradeForm
          onSubmit={handleSubmitGrade}
          isLoading={isFormLoading}
          onCancel={() => setIsGradeModalOpen(false)}
        />
      </Modal>
    </div>
  );
}