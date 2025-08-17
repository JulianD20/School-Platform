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
import { AttendancePage } from './pages/attendance/AttendancePage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ChildrenPage } from './pages/children/ChildrenPage';
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
                <Route 
                  path="attendance" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <AttendancePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="reports" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'parent', 'student']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute allowedRoles={['student', 'parent', 'teacher', 'admin']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="children" 
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <ChildrenPage />
                    </ProtectedRoute>
                  } 
                />
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