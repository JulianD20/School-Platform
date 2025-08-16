import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { CalendarEvent } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Examen de Matemáticas',
    description: 'Examen final del primer período',
    start: '2024-01-20T09:00:00',
    end: '2024-01-20T11:00:00',
    type: 'exam',
    location: 'Aula 201',
    organizer: 'Carlos Rodríguez',
  },
  {
    id: '2',
    title: 'Reunión de Padres',
    description: 'Reunión general de padres de familia',
    start: '2024-01-22T18:00:00',
    end: '2024-01-22T20:00:00',
    type: 'meeting',
    location: 'Auditorio Principal',
    organizer: 'María González',
  },
  {
    id: '3',
    title: 'Día de la Ciencia',
    description: 'Feria de proyectos científicos',
    start: '2024-01-25',
    type: 'event',
    location: 'Patio Central',
    organizer: 'Ana Torres',
  },
  {
    id: '4',
    title: 'Vacaciones de Invierno',
    description: 'Receso académico',
    start: '2024-02-01',
    end: '2024-02-15',
    type: 'holiday',
    organizer: 'Administración',
  },
];

export function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsEventModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    // Handle date selection for creating new events
    console.log('Date selected:', selectInfo);
    setIsCreateModalOpen(true);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'exam':
        return '#ef4444'; // red
      case 'meeting':
        return '#3b82f6'; // blue
      case 'event':
        return '#10b981'; // green
      case 'holiday':
        return '#f59e0b'; // yellow
      case 'class':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'exam':
        return 'Examen';
      case 'meeting':
        return 'Reunión';
      case 'event':
        return 'Evento';
      case 'holiday':
        return 'Feriado';
      case 'class':
        return 'Clase';
      default:
        return 'Otro';
    }
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: getEventColor(event.type),
    borderColor: getEventColor(event.type),
    textColor: '#ffffff',
  }));

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendario Escolar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de eventos y actividades académicas
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 sm:mt-0">
          <Plus size={20} className="mr-2" />
          Nuevo Evento
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardContent className="p-6">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={calendarEvents}
                eventClick={handleEventClick}
                select={handleDateSelect}
                height="auto"
                locale="es"
                buttonText={{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día'
                }}
                dayHeaderContent={(args) => {
                  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                  return days[args.date.getDay()];
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Próximos Eventos
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEventModalOpen(true);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-3 h-3 rounded-full mt-1"
                          style={{ backgroundColor: getEventColor(event.type) }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock size={12} className="text-gray-500" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(event.start).toLocaleDateString()}
                            </p>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin size={12} className="text-gray-500" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {event.location}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                    No hay eventos próximos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tipos de Eventos
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: 'exam', label: 'Exámenes', count: 3 },
                  { type: 'meeting', label: 'Reuniones', count: 2 },
                  { type: 'event', label: 'Eventos', count: 4 },
                  { type: 'holiday', label: 'Feriados', count: 1 },
                  { type: 'class', label: 'Clases', count: 15 },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getEventColor(item.type) }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                      </span>
                    </div>
                    <Badge variant="default" size="sm">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Detalles del Evento"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedEvent.title}
              </h3>
              <Badge variant="info">
                {getEventTypeLabel(selectedEvent.type)}
              </Badge>
            </div>

            {selectedEvent.description && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Descripción
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Fecha y Hora
                </h4>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock size={16} />
                  <span>
                    {new Date(selectedEvent.start).toLocaleString()}
                    {selectedEvent.end && (
                      <> - {new Date(selectedEvent.end).toLocaleString()}</>
                    )}
                  </span>
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Ubicación
                  </h4>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={16} />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Organizador
              </h4>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Users size={16} />
                <span>{selectedEvent.organizer}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsEventModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button>
                Editar Evento
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Evento"
        size="lg"
      >
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Funcionalidad de creación de eventos en desarrollo
          </p>
          <Button
            className="mt-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}