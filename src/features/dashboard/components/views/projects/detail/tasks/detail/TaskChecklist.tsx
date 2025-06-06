// features/dashboard/components/views/projects/detail/tasks/detail/TaskChecklist.tsx

'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '@/features/dashboard/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskChecklistProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
  isEditing: boolean;
}

function SortableChecklistItem({
  item,
  onToggle,
  onUpdate,
  onDelete,
  isEditing,
}: {
  item: ChecklistItem;
  onToggle: () => void;
  onUpdate: (text: string) => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate(editText);
    setIsEditingItem(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg",
        isDragging && "opacity-50"
      )}
    >
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={onToggle}
        className="flex-shrink-0"
      />

      {isEditingItem ? (
        <div className="flex-1 flex gap-2">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditingItem(false);
            }}
            className="flex-1 h-8"
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>저장</Button>
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 text-sm cursor-pointer",
            item.isCompleted && "line-through text-gray-500"
          )}
          onClick={() => isEditing && setIsEditingItem(true)}
        >
          {item.text}
        </div>
      )}

      {isEditing && !isEditingItem && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onDelete}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

export default function TaskChecklist({
  checklist,
  onChange,
  isEditing,
}: TaskChecklistProps) {
  const [newItemText, setNewItemText] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const completedCount = checklist.filter(item => item.isCompleted).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        isCompleted: false,
      };
      onChange([...checklist, newItem]);
      setNewItemText('');
    }
  };

  const handleToggleItem = (id: string) => {
    onChange(
      checklist.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleUpdateItem = (id: string, text: string) => {
    onChange(
      checklist.map(item =>
        item.id === id ? { ...item, text } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    onChange(checklist.filter(item => item.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = checklist.findIndex(item => item.id === active.id);
      const newIndex = checklist.findIndex(item => item.id === over?.id);
      onChange(arrayMove(checklist, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      {checklist.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedCount} / {checklist.length} 완료
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Checklist Items */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={checklist.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {checklist.map((item) => (
              <SortableChecklistItem
                key={item.id}
                item={item}
                onToggle={() => handleToggleItem(item.id)}
                onUpdate={(text) => handleUpdateItem(item.id, text)}
                onDelete={() => handleDeleteItem(item.id)}
                isEditing={isEditing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add New Item */}
      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddItem();
            }}
            placeholder="새 항목 추가..."
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}