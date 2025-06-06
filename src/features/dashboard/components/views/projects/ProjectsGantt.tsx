'use client';

import React, { useState, useMemo } from 'react';
import { Gantt, Task as GanttTaskType, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Project, Task } from '@/features/dashboard/types';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { 
  ZoomIn, ZoomOut, Maximize2, Calendar,
  Download, Filter, Users, Clock
} from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import GanttTooltip from './gantt/GanttTooltip';
import GanttHeader from './gantt/GanttHeader';
import GanttListTable from './gantt/GanttListTable';

interface ProjectsGanttProps {
  projects: Project[];
}

export default function ProjectsGantt({ projects }: ProjectsGanttProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [showOnlyMilestones, setShowOnlyMilestones] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // 프로젝트와 태스크를 Gantt 형식으로 변환
  const ganttTasks = useMemo(() => {
    const tasks: GanttTaskType[] = [];

    projects.forEach((project) => {
      // 선택된 프로젝트 필터링
      if (selectedProject !== 'all' && project.id !== selectedProject) {
        return;
      }

      // 프로젝트 추가
      if (project.startDate && project.endDate) {
        tasks.push({
          start: new Date(project.startDate),
          end: new Date(project.endDate),
          name: project.name,
          id: project.id,
          type: 'project',
          progress: project.progress || 0,
          hideChildren: false,
          styles: {
            backgroundColor: '#8b5cf6',
            backgroundSelectedColor: '#7c3aed',
            progressColor: '#a78bfa',
            progressSelectedColor: '#8b5cf6',
          },
        });

        // 프로젝트의 태스크 추가 (실제로는 API에서 가져와야 함)
        // 여기서는 예시 데이터 사용
        const mockTasks = [
          {
            id: `${project.id}-task-1`,
            name: '요구사항 분석',
            start: new Date(project.startDate),
            end: new Date(new Date(project.startDate).getTime() + 7 * 24 * 60 * 60 * 1000),
            progress: 100,
            project: project.id,
            type: 'task' as const,
          },
          {
            id: `${project.id}-task-2`,
            name: '설계',
            start: new Date(new Date(project.startDate).getTime() + 7 * 24 * 60 * 60 * 1000),
            end: new Date(new Date(project.startDate).getTime() + 14 * 24 * 60 * 60 * 1000),
            progress: 80,
            project: project.id,
            type: 'task' as const,
            dependencies: [`${project.id}-task-1`],
          },
          {
            id: `${project.id}-milestone-1`,
            name: '설계 완료',
            start: new Date(new Date(project.startDate).getTime() + 14 * 24 * 60 * 60 * 1000),
            end: new Date(new Date(project.startDate).getTime() + 14 * 24 * 60 * 60 * 1000),
            progress: 0,
            project: project.id,
            type: 'milestone' as const,
            dependencies: [`${project.id}-task-2`],
          },
        ];

        if (!showOnlyMilestones) {
          tasks.push(...mockTasks);
        } else {
          tasks.push(...mockTasks.filter(t => t.type === 'milestone'));
        }
      }
    });

    return tasks;
  }, [projects, selectedProject, showOnlyMilestones]);

  const handleTaskChange = (task: GanttTaskType) => {
    console.log("Task changed:", task);
    // TODO: API 호출하여 태스크 업데이트
  };

  const handleProgressChange = (task: GanttTaskType) => {
    console.log("Progress changed:", task);
    // TODO: API 호출하여 진행률 업데이트
  };

  const handleExpanderClick = (task: GanttTaskType) => {
    console.log("Expander clicked:", task);
  };

  const handleExport = () => {
    // TODO: Gantt 차트 내보내기 구현
    console.log("Export Gantt chart");
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Mode */}
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
                <SelectItem value={ViewMode.Year}>년</SelectItem>
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="프로젝트 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 프로젝트</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filters */}
            <Button
              variant={showOnlyMilestones ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyMilestones(!showOnlyMilestones)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              마일스톤만
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
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
              onExpanderClick={handleExpanderClick}
              listCellWidth=""
              ganttHeight={600}
              columnWidth={viewMode === ViewMode.Month ? 150 : 60}
              locale={ko}
              barCornerRadius={3}
              barFill={70}
              arrowColor="#9ca3af"
              arrowIndent={20}
              todayColor="rgba(139, 92, 246, 0.1)"
              TooltipContent={GanttTooltip}
              TaskListHeader={GanttHeader}
              TaskListTable={GanttListTable}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>표시할 일정이 없습니다.</p>
            </div>
          </div>
        )}
      </Card>

      {/* Custom Styles */}
      <style jsx global>{`
        .gantt-wrapper {
          overflow: auto;
        }
        
        .gantt-container-wrapper {
          overflow: visible !important;
        }
        
        ._3S69O {
          fill: #374151 !important;
        }
        
        ._1eUo8 {
          stroke: #e5e7eb !important;
        }
        
        ._2oc9l {
          fill: #6b7280 !important;
        }
        
        /* Dark mode support */
        .dark ._3S69O {
          fill: #e5e7eb !important;
        }
        
        .dark ._1eUo8 {
          stroke: #374151 !important;
        }
        
        .dark ._2oc9l {
          fill: #9ca3af !important;
        }
        
        .dark ._34SS0 {
          fill: #1f2937 !important;
        }
        
        .dark ._hUOA {
          fill: #374151 !important;
        }
      `}</style>
    </div>
  );
}