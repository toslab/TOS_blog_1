// features/dashboard/components/views/projects/ProjectsList.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/features/dashboard/types';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Progress } from '@/components/dashboard_UI/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { 
  MoreVertical, Users, Calendar, Clock, 
  ChevronRight, Edit, Archive, Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProjectsListProps {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectsList({ projects, onRefresh }: ProjectsListProps) {
  const router = useRouter();

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[status] || colors.planning;
  };

  const getStatusLabel = (status: Project['status']) => {
    const labels = {
      planning: '계획중',
      active: '진행중',
      on_hold: '보류',
      completed: '완료',
      archived: '보관',
    };
    return labels[status] || status;
  };

  const getPriorityIndicator = (priority: number) => {
    if (priority >= 80) return { color: 'bg-red-500', label: '긴급' };
    if (priority >= 60) return { color: 'bg-orange-500', label: '높음' };
    if (priority >= 40) return { color: 'bg-yellow-500', label: '보통' };
    return { color: 'bg-green-500', label: '낮음' };
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const priority = getPriorityIndicator(project.priority);
        
        return (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {/* Priority Indicator */}
                    <div className={cn(
                      "w-1 h-16 rounded-full flex-shrink-0",
                      priority.color
                    )} />
                    
                    <div className="flex-1">
                      {/* Title & Code */}
                      <div className="flex items-center gap-2 mb-1">
                        <Link 
                          href={`/dashboard/projects/${project.id}`}
                          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                        >
                          {project.name}
                        </Link>
                        <Badge variant="outline" className="font-mono text-xs">
                          {project.code}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                        {project.isOverdue && (
                          <Badge variant="destructive">마감 초과</Badge>
                        )}
                      </div>
                      
                      {/* Description */}
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            진행률
                          </span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.memberCount}명</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {project.startDate && formatDate(project.startDate)}
                            {project.endDate && ` - ${formatDate(project.endDate)}`}
                          </span>
                        </div>
                        
                        {project.daysRemaining !== undefined && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {project.daysRemaining > 0 
                                ? `${project.daysRemaining}일 남음`
                                : '마감'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                  {/* Owner Avatar */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {project.myRole === 'owner' ? '소유자' : 
                       project.myRole === 'approver' ? '승인자' :
                       project.myRole === 'member' ? '멤버' : '뷰어'}
                    </p>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={project.owner?.profileImage} />
                      <AvatarFallback>
                        {project.owner?.fullName?.slice(0, 2) || project.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          보관
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}