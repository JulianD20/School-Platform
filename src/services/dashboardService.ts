import api from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalStudents: 248,
      totalTeachers: 15,
      totalSubjects: 12,
      totalCommunications: 23,
      attendanceRate: 94.5,
      averageGrades: 8.2,
    };
  },

  async getAttendanceChart(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { name: 'Lun', present: 95, absent: 5 },
      { name: 'Mar', present: 92, absent: 8 },
      { name: 'Mié', present: 98, absent: 2 },
      { name: 'Jue', present: 89, absent: 11 },
      { name: 'Vie', present: 94, absent: 6 },
    ];
  },

  async getGradesChart(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { subject: 'Matemáticas', average: 8.5 },
      { subject: 'Historia', average: 8.8 },
      { subject: 'Biología', average: 8.2 },
      { subject: 'Química', average: 7.9 },
      { subject: 'Física', average: 8.1 },
    ];
  },
};