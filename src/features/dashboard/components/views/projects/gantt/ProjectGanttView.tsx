'use client';

import React, { useState, useMemo } from 'react';
import { Gantt, Task as GanttTaskType, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { 
  Calendar, Download, Filter, Users, 
  Settings, RefreshCw, Save, ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/dashboard_UI/use-toast';
import GanttTooltip from '../gantt/GanttTooltip';
import GanttListTable from '../gantt/GanttListTable';

interface ProjectGanttViewProps {
  data: any;
  projectId: string;
}

export default function ProjectGanttView({ data, projectId }: ProjectGanttViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [modifiedTasks, setModifiedTasks] = useState<Map<string, GanttTaskType>>(new Map());

  // API 데이터를 Gantt 형식으로 변환
  const ganttTasks = useMemo(() => {
    const tasks: GanttTaskType[] = [];

    // 프로젝트 추가
    if (data.project.start_date && data.project.end_date) {
      tasks.push({
        start: new Date(data.project.start_date),
        end: new Date(data.project.end_date),
        name: data.project.name,
        id: data.project.id,
        type: 'project',
        progress: data.project.progress || 0,
        hideChildren: false,
        styles: {
          backgroundColor: '#8b5cf6',
          backgroundSelectedColor: '#7c3aed',
        },
      });
    }

    // 태스크 추가
    data.tasks.forEach((task: any) => {
      if (task.start_date && task.due_date) {
        const taskItem: GanttTaskType = {
          start: new Date(task.start_date),
          end: new Date(task.due_date),
          name: task.title,
          id: task.id,
          type: 'task',
          progress: task.progress || 0,
          project: data.project.id,
          dependencies: task.dependencies || [],
          styles: {
            backgroundColor: getPriorityColor(task.priority),
            backgroundSelectedColor: getPriorityColorDark(task.priority),
          },
        };
        tasks.push(taskItem);
      }
    });

    return tasks;
  }, [data]);

  // 태스크 업데이트 뮤테이션
  const updateTask = useMutation({
    mutationFn: async (updates: { taskId: string; data: any }) => {
      return apiClient.patch(
        `/projects/${projectId}/tasks/${updates.taskId}/`,
        updates.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-gantt', projectId] });
      toast({
        title: '저장 완료',
        description: '변경사항이 저장되었습니다.',
      });
    },
    onError: () => {
      toast({
        title: '저장 실패',
        description: '변경사항을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleTaskChange = (task: GanttTaskType) => {
    // 수정된 태스크 추적
    setModifiedTasks(prev => new Map(prev).set(task.id, task));
  };

  const handleProgressChange = (task: GanttTaskType) => {
    // 진행률 변경 즉시 저장
    if (task.type === 'task') {
      updateTask.mutate({
        taskId: task.id,
        data: { progress: Math.round(task.progress) }
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsAutoSaving(true);
    
    const updates = Array.from(modifiedTasks.entries()).map(([id, task]) => {
      if (task.type === 'task') {
        return updateTask.mutateAsync({
          taskId: id,
          data: {
            start_date: format(task.start, 'yyyy-MM-dd'),
            due_date: format(task.end, 'yyyy-MM-dd'),
          }
        });
      }
      return Promise.resolve();
    });

    await Promise.all(updates);
    setModifiedTasks(new Map());
    setIsAutoSaving(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getPriorityColorDark = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#4b5563';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            프로젝트로 돌아가기
          </Button>
          <h1 className="text-2xl font-bold">{data.project.name} - Gantt 차트</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {modifiedTasks.size > 0 && (
            <Badge variant="secondary">
              {modifiedTasks.size}개 변경사항
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveChanges}
            disabled={modifiedTasks.size === 0 || isAutoSaving}
          >
            {isAutoSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                변경사항 저장
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ViewMode.Day}>일</SelectItem>
                <SelectItem value={ViewMode.Week}>주</SelectItem>
                <SelectItem value={ViewMode.Month}>월</SelectItem>
                <SelectItem value={ViewMode.QuarterYear}>분기</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {data.tasks.length}개 태스크
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </Card>

      {/* Gantt Chart */}
      <Card className="overflow-hidden">
        {ganttTasks.length > 0 ? (
          <div className="gantt-wrapper">
            <Gantt
              tasks={ganttTasks}
              viewMode={viewMode}
              onDateChange={handleTaskChange}
              onProgressChange={handleProgressChange}
              listCellWidth="35%"
              ganttHeight={Math.max(400, ganttTasks.length * 50 + 100)}
              columnWidth={viewMode === ViewMode.Month ? 150 : 60}
              locale={ko}
              barCornerRadius={3}
              barFill={70}
              arrowColor="#9ca3af"
              arrowIndent={20}
              todayColor="rgba(139, 92, 246, 0.1)"
              TooltipContent={GanttTooltip}
              TaskListTable={(props) => <GanttListTable {...props} />}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>시작일과 종료일이 설정된 태스크가 없습니다.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}