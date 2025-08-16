import api from './api';
import { Subject, Grade, Attendance, GradeFormData } from '../types';

// Mock data
const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Matemáticas',
    code: 'MAT001',
    teacherId: '2',
    teacherName: 'Carlos Rodríguez',
    grade: '10A',
    credits: 4,
  },
  {
    id: '2',
    name: 'Historia',
    code: 'HIS001',
    teacherId: '2',
    teacherName: 'Carlos Rodríguez',
    grade: '10A',
    credits: 3,
  },
  {
    id: '3',
    name: 'Biología',
    code: 'BIO001',
    teacherId: '2',
    teacherName: 'Carlos Rodríguez',
    grade: '10A',
    credits: 3,
  },
];

const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    subjectName: 'Matemáticas',
    teacherId: '2',
    value: 8.5,
    maxValue: 10,
    period: '2024-1',
    type: 'exam',
    date: '2024-03-15',
    comments: 'Excelente desempeño',
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '2',
    subjectName: 'Historia',
    teacherId: '2',
    value: 9.0,
    maxValue: 10,
    period: '2024-1',
    type: 'project',
    date: '2024-03-20',
  },
];

const mockAttendance: Attendance[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Diego Martínez',
    subjectId: '1',
    subjectName: 'Matemáticas',
    date: '2024-03-15',
    status: 'present',
    teacherId: '2',
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Diego Martínez',
    subjectId: '2',
    subjectName: 'Historia',
    date: '2024-03-15',
    status: 'absent',
    teacherId: '2',
  },
];

export const academicService = {
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSubjects;
  },

  async getSubjectById(id: string): Promise<Subject> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const subject = mockSubjects.find(s => s.id === id);
    if (!subject) throw new Error('Materia no encontrada');
    return subject;
  },

  // Grades
  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockGrades.filter(g => g.studentId === studentId);
  },

  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockGrades.filter(g => g.subjectId === subjectId);
  },

  async createGrade(data: GradeFormData): Promise<Grade> {
    try {
      const response = await api.post('/grades', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar calificación');
    }
  },

  // Attendance
  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAttendance.filter(a => a.studentId === studentId);
  },

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAttendance.filter(a => a.date === date);
  },

  async recordAttendance(studentId: string, subjectId: string, date: string, status: 'present' | 'absent' | 'late' | 'justified'): Promise<void> {
    try {
      await api.post('/attendance', { studentId, subjectId, date, status });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar asistencia');
    }
  },
};