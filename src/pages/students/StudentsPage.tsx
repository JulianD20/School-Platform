import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { StudentForm } from '../../components/forms/StudentForm';
import { useDebounce } from '../../hooks/useDebounce';
import { studentService } from '../../services/studentService';
import { Student, StudentFormData } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const studentsPerPage = 10;

  useEffect(() => {
    loadStudents();
  }, [currentPage, debouncedSearchTerm]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const response = await studentService.getStudents(currentPage, studentsPerPage, debouncedSearchTerm);
      setStudents(response.students);
      setTotalStudents(response.total);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      try {
        await studentService.deleteStudent(studentId);
        loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleSubmitForm = async (data: StudentFormData) => {
    setIsFormLoading(true);
    try {
      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, data);
      } else {
        await studentService.createStudent(data);
      }
      setIsModalOpen(false);
      loadStudents();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Estudiantes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona la información de los estudiantes
          </p>
        </div>
        <Button onClick={handleCreateStudent} className="mt-4 sm:mt-0">
          <Plus size={20} className="mr-2" />
          Nuevo Estudiante
        </Button>
      </motion.div>

      {/* Search and Filters */}
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
            placeholder="Buscar estudiantes por nombre o email..."
          />
        </div>
        <Button variant="outline">
          <Filter size={20} className="mr-2" />
          Filtros
        </Button>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Estudiante</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Grado</TableHeaderCell>
                <TableHeaderCell>Fecha de Matrícula</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{student.grade}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'success' : 'danger'}>
                      {student.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {(currentPage - 1) * studentsPerPage + 1} a{' '}
            {Math.min(currentPage * studentsPerPage, totalStudents)} de {totalStudents} estudiantes
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-3 py-1 text-sm">
              {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </motion.div>
      )}

      {/* Student Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        size="lg"
      >
        <StudentForm
          initialData={selectedStudent || undefined}
          onSubmit={handleSubmitForm}
          isLoading={isFormLoading}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}