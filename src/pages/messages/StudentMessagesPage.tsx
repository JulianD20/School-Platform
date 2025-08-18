import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Inbox, TentIcon as SentIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { MessageForm } from '../../components/forms/MessageForm';
import { Message, MessageFormData } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Carlos Rodríguez',
    recipientId: '4',
    recipientName: 'Diego Martínez',
    subject: 'Felicitaciones por tu examen',
    content: 'Hola Diego, quería felicitarte por tu excelente desempeño en el último examen de matemáticas...',
    isRead: false,
    sentAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    senderId: '4',
    senderName: 'Diego Martínez',
    recipientId: '2',
    recipientName: 'Carlos Rodríguez',
    subject: 'Consulta sobre tarea',
    content: 'Profesor, tengo una duda sobre el ejercicio 5 de la tarea de esta semana...',
    isRead: true,
    sentAt: '2024-01-14T14:20:00Z',
  },
];

export function StudentMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (data: MessageFormData) => {
    setIsFormLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sending message:', data);
      setIsComposeModalOpen(false);
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageModalOpen(true);
    
    if (!message.isRead) {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        )
      );
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'inbox' ? 
      message.recipientId === '4' : // Current student ID
      message.senderId === '4';
    
    return matchesSearch && matchesTab;
  });

  const unreadCount = messages.filter(m => !m.isRead && m.recipientId === '4').length;

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
            Mensajes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comunicación con docentes
          </p>
        </div>
        <Button onClick={() => setIsComposeModalOpen(true)} className="mt-4 sm:mt-0">
          <Plus size={20} className="mr-2" />
          Nuevo Mensaje
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTab('inbox')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'inbox'
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <Inbox size={18} />
                  <span>Recibidos</span>
                  {unreadCount > 0 && (
                    <Badge variant="danger" size="sm">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedTab('sent')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'sent'
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <SentIcon size={18} />
                  <span>Enviados</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-4"
        >
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar mensajes..."
          />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTab === 'inbox' ? 'Mensajes Recibidos' : 'Mensajes Enviados'}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        !message.isRead && selectedTab === 'inbox'
                          ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${
                              !message.isRead && selectedTab === 'inbox'
                                ? 'text-blue-900 dark:text-blue-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {selectedTab === 'inbox' ? message.senderName : message.recipientName}
                            </p>
                            {!message.isRead && selectedTab === 'inbox' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            !message.isRead && selectedTab === 'inbox'
                              ? 'text-blue-800 dark:text-blue-300'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(message.sentAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No se encontraron mensajes
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Nuevo Mensaje"
        size="lg"
      >
        <MessageForm
          onSubmit={handleSendMessage}
          isLoading={isFormLoading}
          onCancel={() => setIsComposeModalOpen(false)}
        />
      </Modal>

      {/* View Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title="Mensaje"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedMessage.subject}
              </h3>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>De:</strong> {selectedMessage.senderName}
                </p>
                <p>
                  {new Date(selectedMessage.sentAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button>
                <Send size={16} className="mr-2" />
                Responder
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}