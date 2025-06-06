// src/features/dashboard/types/gantt.ts

export interface GanttTask {
    id: string;
    name: string;
    type: 'task' | 'milestone' | 'project';
    start: Date;
    end: Date;
    progress: number;
    styles?: {
      backgroundColor?: string;
      backgroundSelectedColor?: string;
      progressColor?: string;
      progressSelectedColor?: string;
    };
    isDisabled?: boolean;
    project?: string;
    dependencies?: string[];
    hideChildren?: boolean;
    displayOrder?: number;
    // 커스텀 필드
    assignee?: {
      id: string;
      name: string;
      avatar?: string;
    };
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    description?: string;
  }
  
  export interface GanttViewMode {
    viewMode: 'Hour' | 'QuarterDay' | 'HalfDay' | 'Day' | 'Week' | 'Month' | 'QuarterYear' | 'Year';
    viewDate?: Date;
  }
  