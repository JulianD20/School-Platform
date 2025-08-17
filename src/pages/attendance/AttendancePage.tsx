import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  subject?: string;
  notes?: string;
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Diego Martínez',
    grade: '10A',
    date: '2024-01-15',
    status: 'present',
    subject: 'Matemáticas',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Sofia García',
    grade: '9B',
    date: '2024-01-15',
    status: 'absent',
    subject: 'Matemáticas',
    notes: 'Enfermedad justificada',
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Miguel Torres',
    grade: '11A',
    date: '2024-01-15',
    status: 'late',
    subject: 'Matemáticas',
    notes: 'Llegó 15 minutos tarde',
  },
];

export function AttendancePage() {
  const { state } = useAuth();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState('');

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate, selectedGrade]);

  const loadAttendanceData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAttendanceData(mockAttendanceData);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (recordId: string, newStatus: 'present' | 'absent' | 'late' | 'justified') => {
    setAttendanceData(prev =>
      prev.map(record =>
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      case 'justified':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Tardanza';
      case 'justified':
        return 'Justificado';
      default:
        return status;
    }
  };

  const filteredData = attendanceData.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGrade === '' || record.grade === selectedGrade)
  );

  const attendanceStats = {
    total: filteredData.length,
    present: filteredData.filter(r => r.status === 'present').length,
    absent: filteredData.filter(r => r.status === 'absent').length,
    late: filteredData.filter(r => r.status === 'late').length,
  };

  const attendanceRate = attendanceStats.total > 0 
    ? ((attendanceStats.present / attendanceStats.total) * 100).toFixed(1)
    : '0';

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
            Control de Asistencia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión y seguimiento de asistencia estudiantil
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Exportar
          </Button>
          {state.user?.role === 'admin' && (
            <Button>
              <Calendar size={20} className="mr-2" />
              Nuevo Registro
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Estudiantes"
          value={attendanceStats.total}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Presentes"
          value={attendanceStats.present}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Ausentes"
          value={attendanceStats.absent}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="Tasa de Asistencia"
          value={`${attendanceRate}%`}
          icon={Clock}
          color="purple"
        />
      </div>

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
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todos los grados</option>
            <option value="9A">9A</option>
            <option value="9B">9B</option>
            <option value="10A">10A</option>
            <option value="10B">10B</option>
            <option value="11A">11A</option>
            <option value="11B">11B</option>
          </select>
        </div>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Registro de Asistencia - {new Date(selectedDate).toLocaleDateString()}
            </h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Estudiante</TableHeaderCell>
                  <TableHeaderCell>Grado</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell>Materia</TableHeaderCell>
                  <TableHeaderCell>Notas</TableHeaderCell>
                  {state.user?.role !== 'parent' && (
                    <TableHeaderCell>Acciones</TableHeaderCell>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {record.studentName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {record.studentName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{record.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status) as any}>
                        {getStatusLabel(record.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {record.subject || '-'}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {record.notes || '-'}
                    </TableCell>
                    {state.user?.role !== 'parent' && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <select
                            value={record.status}
                            onChange={(e) => handleStatusChange(record.id, e.target.value as any)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          >
                            <option value="present">Presente</option>
                            <option value="absent">Ausente</option>
                            <option value="late">Tardanza</option>
                            <option value="justified">Justificado</option>
                          </select>
                        </div>
                      </TableCell>
                    )}
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