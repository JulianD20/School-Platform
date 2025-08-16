import api from './api';
import { User, UserRole } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@escuela.com',
    firstName: 'María',
    lastName: 'González',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'teacher@escuela.com',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    role: 'teacher',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    email: 'parent@escuela.com',
    firstName: 'Ana',
    lastName: 'López',
    role: 'parent',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    email: 'student@escuela.com',
    firstName: 'Diego',
    lastName: 'Martínez',
    role: 'student',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Mock authentication for demo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    if (password !== '123456') {
      throw new Error('Credenciales inválidas');
    }

    return {
      user,
      token: `mock-jwt-token-${user.id}`,
    };
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post('/auth/refresh');
      return response.data.token;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al refrescar token');
    }
  },
};