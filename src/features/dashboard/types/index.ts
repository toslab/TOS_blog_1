//features/dashboard/types/index.ts
// User types
export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: 'admin' | 'approver' | 'member' | 'viewer';
    profileImage?: string;
    department?: string;
    position?: string;
    isActive: boolean;
    lastSeen?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Project types
  export interface Project {
    id: string;
    name: string;
    description: string;
    code: string;
    status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
    owner: User;
    startDate?: string;
    endDate?: string;
    budget?: number;
    priority: number;
    isPublic: boolean;
    tags: string[];
    progress: number;
    isOverdue: boolean;
    daysRemaining?: number;
    memberCount: number;
    taskCount: number;
    myRole?: 'owner' | 'approver' | 'member' | 'viewer';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProjectMember {
    id: string;
    user: User;
    role: 'owner' | 'approver' | 'member' | 'viewer';
    joinedAt: string;
    invitedBy?: User;
    isActive: boolean;
    permissions: Record<string, boolean>;
  }
  
  // Task types
  export interface Task {
    id: string;
    project: string;
    taskNumber: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee?: User;
    startDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
    progress: number;
    isOverdue: boolean;
    isBlocked: boolean;
    tags: string[];
    attachments: any[];
    checklist: ChecklistItem[];
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  }
  
  export interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
  }
  
  export interface TaskComment {
    id: string;
    user: User;
    content: string;
    mentions: User[];
    parent?: string;
    replies?: TaskComment[];
    isEdited: boolean;
    editedAt?: string;
    createdAt: string;
  }
  
  export interface TaskActivity {
    id: string;
    user: User;
    activityType: string;
    activityTypeDisplay: string;
    description: string;
    metadata: any;
    createdAt: string;
  }
  
  // Navigation types
  export interface NavigationItem {
    id: string;
    name: string;
    icon: any;
    href?: string;
    badge?: number;
    requiredRoles?: string[];
    children?: NavigationItem[];
  }