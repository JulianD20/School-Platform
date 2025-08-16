// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Student Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  grade: string;
  enrollmentDate: string;
  parentId?: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

// Academic Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  grade: string;
  credits: number;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  value: number;
  maxValue: number;
  period: string;
  type: 'exam' | 'homework' | 'quiz' | 'project';
  date: string;
  comments?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  teacherId: string;
}

// Communication Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  attachments?: string[];
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientType: 'all' | 'teachers' | 'parents' | 'students' | 'specific';
  recipientIds?: string[];
  priority: 'low' | 'medium' | 'high';
  publishDate: string;
  expiryDate?: string;
  attachments?: string[];
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  type: 'class' | 'exam' | 'meeting' | 'event' | 'holiday';
  location?: string;
  organizer: string;
  attendees?: string[];
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  totalCommunications: number;
  attendanceRate: number;
  averageGrades: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  grade: string;
  enrollmentDate: string;
  parentId?: string;
}

export interface GradeFormData {
  studentId: string;
  subjectId: string;
  value: number;
  maxValue: number;
  type: 'exam' | 'homework' | 'quiz' | 'project';
  date: string;
  comments?: string;
}

export interface MessageFormData {
  recipientId: string;
  subject: string;
  content: string;
}

export interface CommunicationFormData {
  title: string;
  content: string;
  recipientType: 'all' | 'teachers' | 'parents' | 'students';
  priority: 'low' | 'medium' | 'high';
  publishDate: string;
  expiryDate?: string;
}