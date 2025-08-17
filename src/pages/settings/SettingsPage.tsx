import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, School, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useTheme } from '../../context/ThemeContext';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'Configuración General',
    icon: Settings,
    description: 'Configuración básica del sistema',
  },
  {
    id: 'users',
    title: 'Gestión de Usuarios',
    icon: Users,
    description: 'Administrar usuarios y permisos',
  },
  {
    id: 'academic',
    title: 'Configuración Académica',
    icon: School,
    description: 'Períodos, grados y materias',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: Bell,
    description: 'Configurar alertas y notificaciones',
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: Shield,
    description: 'Políticas de seguridad y acceso',
  },
  {
    id: 'backup',
    title: 'Respaldo de Datos',
    icon: Database,
    description: 'Configurar copias de seguridad',
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    icon: Palette,
    description: 'Personalizar la interfaz',
  },
  {
    id: 'system',
    title: 'Sistema',
    icon: Globe,
    description: 'Configuración del sistema',
  },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Sistema de Gestión Escolar',
    schoolAddress: 'Calle Principal #123, Ciudad',
    schoolPhone: '+1 234 567 8900',
    schoolEmail: 'info@escuela.com',
    academicYear: '2024',
    timezone: 'America/Bogota',
  });

  const [academicSettings, setAcademicSettings] = useState({
    gradingScale: '10',
    passingGrade: '7',
    maxAbsences: '20',
    periodsPerYear: '4',
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre de la Institución"
          value={generalSettings.schoolName}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, schoolName: e.target.value }))}
        />
        <Input
          label="Año Académico"
          value={generalSettings.academicYear}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, academicYear: e.target.value }))}
        />
      </div>
      <Input
        label="Dirección"
        value={generalSettings.schoolAddress}
        onChange={(e) => setGeneralSettings(prev => ({ ...prev, schoolAddress: e.target.value }))}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Teléfono"
          value={generalSettings.schoolPhone}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, schoolPhone: e.target.value }))}
        />
        <Input
          label="Email"
          type="email"
          value={generalSettings.schoolEmail}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, schoolEmail: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Zona Horaria
        </label>
        <select
          value={generalSettings.timezone}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="America/Bogota">América/Bogotá (GMT-5)</option>
          <option value="America/Mexico_City">América/Ciudad de México (GMT-6)</option>
          <option value="America/New_York">América/Nueva York (GMT-5)</option>
          <option value="Europe/Madrid">Europa/Madrid (GMT+1)</option>
        </select>
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Escala de Calificación
          </label>
          <select
            value={academicSettings.gradingScale}
            onChange={(e) => setAcademicSettings(prev => ({ ...prev, gradingScale: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="10">1 - 10</option>
            <option value="100">1 - 100</option>
            <option value="5">1 - 5</option>
          </select>
        </div>
        <Input
          label="Nota Mínima Aprobatoria"
          value={academicSettings.passingGrade}
          onChange={(e) => setAcademicSettings(prev => ({ ...prev, passingGrade: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Máximo de Faltas Permitidas"
          value={academicSettings.maxAbsences}
          onChange={(e) => setAcademicSettings(prev => ({ ...prev, maxAbsences: e.target.value }))}
        />
        <Input
          label="Períodos por Año"
          value={academicSettings.periodsPerYear}
          onChange={(e) => setAcademicSettings(prev => ({ ...prev, periodsPerYear: e.target.value }))}
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Modo Oscuro</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cambiar entre tema claro y oscuro
          </p>
        </div>
        <Button
          variant={isDarkMode ? 'primary' : 'outline'}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? 'Activado' : 'Desactivado'}
        </Button>
      </div>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Colores del Sistema</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-900 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Primario</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Secundario</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Éxito</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Error</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estado del Sistema</h4>
            <Badge variant="success">En Línea</Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Última actualización: Hace 5 minutos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Versión</h4>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">v1.0.0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Última versión disponible
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <h4 className="font-medium text-gray-900 dark:text-white">Estadísticas del Sistema</h4>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">248</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">1,234</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Registros</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">99.9%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.1GB</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Almacenamiento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'academic':
        return renderAcademicSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">
              Selecciona una sección para configurar
            </p>
          </div>
        );
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
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra la configuración general del sistema
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Menu */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configuraciones
              </h3>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                {settingsSections.find(s => s.id === activeSection) && (
                  <>
                    {React.createElement(settingsSections.find(s => s.id === activeSection)!.icon, { size: 24 })}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {settingsSections.find(s => s.id === activeSection)?.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {settingsSections.find(s => s.id === activeSection)?.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {renderContent()}
              
              {(activeSection === 'general' || activeSection === 'academic') && (
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                  <Button
                    onClick={handleSaveSettings}
                    isLoading={isLoading}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}