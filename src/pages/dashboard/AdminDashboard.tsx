import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { dashboardService } from '../../services/dashboardService';
import { DashboardStats } from '../../types';

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'];

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [gradesData, setGradesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, attendanceChart, gradesChart] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAttendanceChart(),
          dashboardService.getGradesChart(),
        ]);

        setStats(statsData);
        setAttendanceData(attendanceChart);
        setGradesData(gradesChart);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const gradeDistribution = [
    { name: 'Excelente (9-10)', value: 35 },
    { name: 'Bueno (8-9)', value: 40 },
    { name: 'Regular (7-8)', value: 20 },
    { name: 'Necesita Mejorar (<7)', value: 5 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenido al sistema de gestión escolar
        </p>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Estudiantes"
            value={stats.totalStudents}
            icon={Users}
            color="blue"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Total Docentes"
            value={stats.totalTeachers}
            icon={GraduationCap}
            color="green"
          />
          <StatsCard
            title="Materias"
            value={stats.totalSubjects}
            icon={BookOpen}
            color="purple"
          />
          <StatsCard
            title="Tasa de Asistencia"
            value={`${stats.attendanceRate}%`}
            icon={TrendingUp}
            color="yellow"
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Asistencia Semanal
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#1e3a8a" name="Presentes" />
                  <Bar dataKey="absent" fill="#ef4444" name="Ausentes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Promedio de Calificaciones por Materia
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions
            userRole="admin"
            onAction={(action) => console.log('Action:', action)}
          />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Distribución de Calificaciones
              </h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {gradeDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-sm">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <RecentActivity />
        </div>
      </div>
    </div>
  );
}