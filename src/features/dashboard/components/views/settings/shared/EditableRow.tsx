// src/features/dashboard/components/views/settings/shared/EditableRow.tsx

import React from 'react';
import { Input } from '@/components/dashboard_UI/input';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { Button } from '@/components/dashboard_UI/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import SettingRow from './SettingRow';

interface EditableRowProps {
  field: string;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  form: UseFormReturn<any>;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  updateMutation: any;
}

export default function EditableRow({
  field,
  label,
  type = 'text',
  form,
  editingField,
  setEditingField,
  updateMutation,
}: EditableRowProps) {
  const isEditing = editingField === field;
  const value = form.watch(field);

  if (isEditing) {
    return (
      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </dt>
        <dd className="mt-1 sm:col-span-2 sm:mt-0">
          <form
            onSubmit={form.handleSubmit((data) => {
              updateMutation.mutate({ [field]: data[field] });
            })}
            className="flex gap-2"
          >
            {type === 'textarea' ? (
              <Textarea
                {...form.register(field)}
                className="flex-grow"
                rows={3}
              />
            ) : (
              <Input
                {...form.register(field)}
                type={type}
                className="flex-grow"
              />
            )}
            <Button type="submit" size="sm" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '저장'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingField(null);
                form.reset();
              }}
            >
              취소
            </Button>
          </form>
        </dd>
      </div>
    );
  }

  return (
    <SettingRow
      label={label}
      value={value}
      onUpdate={() => setEditingField(field)}
    />
  );
}