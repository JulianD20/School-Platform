import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GradeFormData } from '../../types';

const gradeSchema = z.object({
  studentId: z.string().min(1, 'Seleccione un estudiante'),
  subjectId: z.string().min(1, 'Seleccione una materia'),
  value: z.number().min(0, 'La calificación debe ser mayor a 0').max(10, 'La calificación máxima es 10'),
  maxValue: z.number().min(1, 'El valor máximo debe ser mayor a 0'),
  type: z.enum(['exam', 'homework', 'quiz', 'project'], { required_error: 'Seleccione el tipo de evaluación' }),
  date: z.string().min(1, 'La fecha es requerida'),
  comments: z.string().optional(),
});

interface GradeFormProps {
  initialData?: Partial<GradeFormData>;
  onSubmit: (data: GradeFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function GradeForm({ initialData, onSubmit, isLoading = false, onCancel }: GradeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: initialData || {
      maxValue: 10,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      value: parseFloat(data.value),
      maxValue: parseFloat(data.maxValue),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estudiante
          </label>
          <select
            {...register('studentId')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Seleccione un estudiante</option>
            <option value="1">Diego Martínez</option>
            <option value="2">Sofia García</option>
            <option value="3">Miguel Torres</option>
          </select>
          {errors.studentId && (
            <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Materia
          </label>
          <select
            {...register('subjectId')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Seleccione una materia</option>
            <option value="1">Matemáticas</option>
            <option value="2">Historia</option>
            <option value="3">Biología</option>
          </select>
          {errors.subjectId && (
            <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Calificación"
          type="number"
          step="0.1"
          min="0"
          max="10"
          {...register('value', { valueAsNumber: true })}
          error={errors.value?.message}
        />
        <Input
          label="Valor Máximo"
          type="number"
          step="0.1"
          min="1"
          {...register('maxValue', { valueAsNumber: true })}
          error={errors.maxValue?.message}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo
          </label>
          <select
            {...register('type')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Seleccione el tipo</option>
            <option value="exam">Examen</option>
            <option value="homework">Tarea</option>
            <option value="quiz">Quiz</option>
            <option value="project">Proyecto</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
      </div>

      <Input
        label="Fecha"
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Comentarios (Opcional)
        </label>
        <textarea
          {...register('comments')}
          rows={3}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Agregar comentarios sobre la evaluación..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Registrar Calificación
        </Button>
      </div>
    </form>
  );
}