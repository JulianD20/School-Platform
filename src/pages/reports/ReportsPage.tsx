import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, User, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  period: string;
  academicYear: string;
  overallGrade: number;
  subjects: {
    name: string;
    grade: number;
    credits: number;
  }[];
  attendance: number;
  behavior: 'Excelente' | 'Bueno' | 'Regular' | 'Necesita Mejorar';
  observations: string;
  generatedDate: string;
}

const mockReports: ReportCard[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Diego Martínez',
    grade: '10A',
    period: 'Primer Período',
    academicYear: '2024',
    overallGrade: 8.5,
    subjects: [
      { name: 'Matemáticas', grade: 8.5, credits: 4 },
      { name: 'Historia', grade: 9.0, credits: 3 },
      { name: 'Biología', grade: 8.2, credits: 3 },
      { name: 'Química', grade: 7.9, credits: 3 },
      { name: 'Física', grade: 8.1, credits: 3 },
      { name: 'Literatura', grade: 8.7, credits: 2 },
    ],
    attendance: 94,
    behavior: 'Excelente',
    observations: 'Estudiante destacado con excelente rendimiento académico y participación activa en clase.',
    generatedDate: '2024-01-15',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Sofia García',
    grade: '9B',
    period: 'Primer Período',
    academicYear: '2024',
    overallGrade: 9.2,
    subjects: [
      { name: 'Matemáticas', grade: 9.5, credits: 4 },
      { name: 'Historia', grade: 9.0, credits: 3 },
      { name: 'Biología', grade: 9.2, credits: 3 },
      { name: 'Química', grade: 8.8, credits: 3 },
      { name: 'Física', grade: 9.1, credits: 3 },
      { name: 'Literatura', grade: 9.4, credits: 2 },
    ],
    attendance: 98,
    behavior: 'Excelente',
    observations: 'Estudiante ejemplar con rendimiento sobresaliente en todas las materias.',
    generatedDate: '2024-01-15',
  },
];

export function ReportsPage() {
  const { state } = useAuth();
  const [reports, setReports] = useState<ReportCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter reports based on user role
      let filteredReports = mockReports;
      if (state.user?.role === 'student') {
        filteredReports = mockReports.filter(report => report.studentId === state.user?.id);
      } else if (state.user?.role === 'parent') {
        // Mock: parent can see reports for their children
        filteredReports = mockReports.filter(report => report.studentId === '1');
      }
      
      setReports(filteredReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (report: ReportCard) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleDownloadPDF = async (report: ReportCard) => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`boletin-${report.studentName.replace(' ', '-')}-${report.period}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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

  const filteredReports = reports.filter(report =>
    report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedPeriod === '' || report.period === selectedPeriod)
  );

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
            Boletines Académicos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Consulta y descarga los boletines de calificaciones
          </p>
        </div>
        {state.user?.role === 'admin' && (
          <Button>
            <FileText size={20} className="mr-2" />
            Generar Boletines
          </Button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar estudiante..."
          />
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Todos los períodos</option>
          <option value="Primer Período">Primer Período</option>
          <option value="Segundo Período">Segundo Período</option>
          <option value="Tercer Período">Tercer Período</option>
          <option value="Final">Final</option>
        </select>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lista de Boletines
            </h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Estudiante</TableHeaderCell>
                  <TableHeaderCell>Período</TableHeaderCell>
                  <TableHeaderCell>Promedio</TableHeaderCell>
                  <TableHeaderCell>Asistencia</TableHeaderCell>
                  <TableHeaderCell>Comportamiento</TableHeaderCell>
                  <TableHeaderCell>Fecha</TableHeaderCell>
                  <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <User className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {report.studentName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {report.grade}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{report.period}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-lg font-semibold ${getGradeColor(report.overallGrade)}`}>
                        {report.overallGrade.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {report.attendance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBehaviorColor(report.behavior) as any}>
                        {report.behavior}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(report)}
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Boletín Académico"
        size="xl"
      >
        {selectedReport && (
          <div id="report-content" className="bg-white p-8 text-black">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-blue-900 pb-6">
              <div className="flex items-center justify-center mb-4">
                <GraduationCap className="text-blue-900" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-blue-900 mb-2">
                SISTEMA DE GESTIÓN ESCOLAR
              </h1>
              <h2 className="text-xl font-semibold text-gray-800">
                BOLETÍN DE CALIFICACIONES
              </h2>
              <p className="text-gray-600 mt-2">
                {selectedReport.period} - Año Académico {selectedReport.academicYear}
              </p>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">INFORMACIÓN DEL ESTUDIANTE</h3>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {selectedReport.studentName}</p>
                  <p><strong>Grado:</strong> {selectedReport.grade}</p>
                  <p><strong>Período:</strong> {selectedReport.period}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">RESUMEN ACADÉMICO</h3>
                <div className="space-y-2">
                  <p><strong>Promedio General:</strong> 
                    <span className={`ml-2 text-lg font-bold ${getGradeColor(selectedReport.overallGrade)}`}>
                      {selectedReport.overallGrade.toFixed(1)}
                    </span>
                  </p>
                  <p><strong>Asistencia:</strong> {selectedReport.attendance}%</p>
                  <p><strong>Comportamiento:</strong> {selectedReport.behavior}</p>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">CALIFICACIONES POR MATERIA</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Materia</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Créditos</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Calificación</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subject.credits}</td>
                      <td className={`border border-gray-300 px-4 py-2 text-center font-semibold ${getGradeColor(subject.grade)}`}>
                        {subject.grade.toFixed(1)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {subject.grade >= 7 ? 'Aprobado' : 'Reprobado'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Observations */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">OBSERVACIONES</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded border">
                {selectedReport.observations}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-blue-900 pt-6 mt-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <p className="text-sm text-gray-600">Director(a)</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <p className="text-sm text-gray-600">Coordinador(a) Académico</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <p className="text-sm text-gray-600">Padre/Madre/Acudiente</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  Fecha de emisión: {new Date(selectedReport.generatedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => setIsReportModalOpen(false)}
          >
            Cerrar
          </Button>
          <Button
            onClick={() => selectedReport && handleDownloadPDF(selectedReport)}
          >
            <Download size={16} className="mr-2" />
            Descargar PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
}