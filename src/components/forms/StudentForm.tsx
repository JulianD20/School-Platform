import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StudentFormData } from '../../types';

const studentSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida'),
  grade: z.string().min(1, 'El grado es requerido'),
  enrollmentDate: z.string().min(1, 'La fecha de matrícula es requerida'),
  parentId: z.string().optional(),
});

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function StudentForm({ initialData, onSubmit, isLoading = false, onCancel }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      enrollmentDate: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          label="Apellido"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha de Nacimiento"
          type="date"
          {...register('dateOfBirth')}
          error={errors.dateOfBirth?.message}
        />
        <Input
          label="Grado"
          {...register('grade')}
          error={errors.grade?.message}
          placeholder="Ej: 10A, 9B"
        />
      </div>

      <Input
        label="Fecha de Matrícula"
        type="date"
        {...register('enrollmentDate')}
        error={errors.enrollmentDate?.message}
      />

      <Input
        label="ID del Padre/Madre (Opcional)"
        {...register('parentId')}
        error={errors.parentId?.message}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Actualizar' : 'Crear'} Estudiante
        </Button>
      </div>
    </form>
  );
}