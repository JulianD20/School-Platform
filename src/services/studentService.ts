import api from './api';
import { Student, StudentFormData } from '../types';

// Mock data for demo
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Diego',
    lastName: 'Martínez',
    email: 'diego.martinez@estudiante.com',
    dateOfBirth: '2008-05-15',
    grade: '10A',
    enrollmentDate: '2024-02-01',
    parentId: '3',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Sofia',
    lastName: 'García',
    email: 'sofia.garcia@estudiante.com',
    dateOfBirth: '2009-03-22',
    grade: '9B',
    enrollmentDate: '2024-02-01',
    status: 'active',
  },
  {
    id: '3',
    firstName: 'Miguel',
    lastName: 'Torres',
    email: 'miguel.torres@estudiante.com',
    dateOfBirth: '2007-11-08',
    grade: '11A',
    enrollmentDate: '2024-02-01',
    status: 'active',
  },
];

export const studentService = {
  async getStudents(page = 1, limit = 10, search = ''): Promise<{ students: Student[]; total: number }> {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredStudents = mockStudents;
    if (search) {
      filteredStudents = mockStudents.filter(student =>
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + limit);

    return {
      students: paginatedStudents,
      total: filteredStudents.length,
    };
  },

  async getStudentById(id: string): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const student = mockStudents.find(s => s.id === id);
    if (!student) {
      throw new Error('Estudiante no encontrado');
    }
    return student;
  },

  async createStudent(data: StudentFormData): Promise<Student> {
    try {
      const response = await api.post('/students', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear estudiante');
    }
  },

  async updateStudent(id: string, data: Partial<StudentFormData>): Promise<Student> {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estudiante');
    }
  },

  async deleteStudent(id: string): Promise<void> {
    try {
      await api.delete(`/students/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar estudiante');
    }
  },
};