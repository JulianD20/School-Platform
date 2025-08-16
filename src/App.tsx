import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { ParentDashboard } from './pages/dashboard/ParentDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { StudentsPage } from './pages/students/StudentsPage';
import { AcademicPage } from './pages/academic/AcademicPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { CalendarPage } from './pages/calendar/CalendarPage';
import { useAuth } from './context/AuthContext';

function DashboardRouter() {
  const { state } = useAuth();
  
  if (!state.user) return null;

  // Redirect to role-specific dashboard
  const getDashboardComponent = () => {
    switch (state.user!.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return getDashboardComponent();
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardRouter />} />
                
                {/* Students Routes */}
                <Route 
                  path="students" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Academic Routes */}
                <Route 
                  path="academic" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                      <AcademicPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Messages Routes */}
                <Route 
                  path="messages" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'parent', 'student']}>
                      <MessagesPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Calendar Routes */}
                <Route 
                  path="calendar" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'parent', 'student']}>
                      <CalendarPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Placeholder routes for other modules */}
                <Route path="attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo de Asistencia</h1><p className="text-gray-600 mt-2">En desarrollo...</p></div>} />
                <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Módulo de Boletines</h1><p className="text-gray-600 mt-2">En desarrollo...</p></div>} />
                <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Configuración</h1><p className="text-gray-600 mt-2">En desarrollo...</p></div>} />
                <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Mi Perfil</h1><p className="text-gray-600 mt-2">En desarrollo...</p></div>} />
                <Route path="children" element={<div className="p-6"><h1 className="text-2xl font-bold">Mis Hijos</h1><p className="text-gray-600 mt-2">En desarrollo...</p></div>} />
              </Route>
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;