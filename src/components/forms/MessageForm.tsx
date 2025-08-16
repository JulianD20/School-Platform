import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageFormData } from '../../types';

const messageSchema = z.object({
  recipientId: z.string().min(1, 'Seleccione un destinatario'),
  subject: z.string().min(1, 'El asunto es requerido'),
  content: z.string().min(1, 'El mensaje es requerido'),
});

interface MessageFormProps {
  onSubmit: (data: MessageFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function MessageForm({ onSubmit, isLoading = false, onCancel }: MessageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const handleFormSubmit = (data: MessageFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Destinatario
        </label>
        <select
          {...register('recipientId')}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Seleccione un destinatario</option>
          <option value="1">María González (Administrador)</option>
          <option value="2">Carlos Rodríguez (Docente)</option>
          <option value="3">Ana López (Padre)</option>
        </select>
        {errors.recipientId && (
          <p className="mt-1 text-sm text-red-600">{errors.recipientId.message}</p>
        )}
      </div>

      <Input
        label="Asunto"
        {...register('subject')}
        error={errors.subject?.message}
        placeholder="Escriba el asunto del mensaje"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mensaje
        </label>
        <textarea
          {...register('content')}
          rows={6}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Escriba su mensaje aquí..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Enviar Mensaje
        </Button>
      </div>
    </form>
  );
}