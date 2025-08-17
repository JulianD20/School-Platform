import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role: string;
  avatar?: string;
  grade?: string;
  parentName?: string;
  emergencyContact?: string;
  subjects?: string[];
  joinDate: string;
}

export function ProfilePage() {
  const { state } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock profile data based on user role
  const [profile, setProfile] = useState<UserProfile>({
    id: state.user?.id || '1',
    firstName: state.user?.firstName || 'Diego',
    lastName: state.user?.lastName || 'Martínez',
    email: state.user?.email || 'diego.martinez@estudiante.com',
    phone: '+1 234 567 8901',
    address: 'Calle 123 #45-67, Ciudad',
    dateOfBirth: '2008-05-15',
    role: state.user?.role || 'student',
    grade: state.user?.role === 'student' ? '10A' : undefined,
    parentName: state.user?.role === 'student' ? 'Ana López' : undefined,
    emergencyContact: '+1 234 567 8902',
    subjects: state.user?.role === 'teacher' ? ['Matemáticas', 'Álgebra', 'Geometría'] : undefined,
    joinDate: '2024-02-01',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      teacher: 'Docente',
      parent: 'Padre de Familia',
      student: 'Estudiante',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'teacher':
        return 'info';
      case 'parent':
        return 'warning';
      case 'student':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra tu información personal
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="mt-4 sm:mt-0">
            <Edit size={20} className="mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleCancel}>
              <X size={20} className="mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              <Save size={20} className="mr-2" />
              Guardar
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="text-blue-600 dark:text-blue-400" size={32} />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.firstName} {profile.lastName}
                </h2>
                <Badge variant={getRoleColor(profile.role) as any} className="mt-2">
                  {getRoleLabel(profile.role)}
                </Badge>
                
                {profile.grade && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Grado {profile.grade}
                  </p>
                )}
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Miembro desde {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {profile.role === 'student' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Estadísticas Rápidas
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Promedio General</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">8.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Asistencia</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Materias</span>
                      <span className="font-semibold text-gray-900 dark:text-white">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información Personal
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <Input
                        label="Nombre"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        icon={<User size={20} />}
                      />
                      <Input
                        label="Apellido"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        icon={<User size={20} />}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <User size={20} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{profile.firstName}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Apellido
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <User size={20} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{profile.lastName}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <Input
                        label="Email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        icon={<Mail size={20} />}
                      />
                      <Input
                        label="Teléfono"
                        value={editedProfile.phone || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        icon={<Phone size={20} />}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Mail size={20} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{profile.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Teléfono
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Phone size={20} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{profile.phone || 'No especificado'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isEditing ? (
                  <Input
                    label="Dirección"
                    value={editedProfile.address || ''}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                    icon={<MapPin size={20} />}
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dirección
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin size={20} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.address || 'No especificada'}</span>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Fecha de Nacimiento"
                    type="date"
                    value={editedProfile.dateOfBirth || ''}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    icon={<Calendar size={20} />}
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar size={20} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'No especificada'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Role-specific information */}
                {profile.role === 'student' && profile.parentName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Padre/Madre/Acudiente
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <User size={20} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.parentName}</span>
                    </div>
                  </div>
                )}

                {profile.role === 'teacher' && profile.subjects && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Materias que Imparte
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {profile.subjects.map((subject, index) => (
                        <Badge key={index} variant="info">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.emergencyContact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contacto de Emergencia
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone size={20} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.emergencyContact}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}