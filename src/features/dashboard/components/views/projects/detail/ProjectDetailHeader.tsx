'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/features/dashboard/types';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, Edit, MoreVertical, Archive, Trash2, 
  Users, Calendar, Clock, AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProjectDetailHeaderProps {
  project: Project;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function ProjectDetailHeader({ 
  project, 
  onEdit, 
  onRefresh 
}: ProjectDetailHeaderProps) {
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

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/projects')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          프로젝트 목록
        </Button>
      </div>

      {/* Project Info */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title & Status */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <Badge className={cn("text-sm", getStatusColor(project.status))}>
              {getStatusLabel(project.status)}
            </Badge>
            {project.isOverdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                마감 초과
              </Badge>
            )}
          </div>

          {/* Code & Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 font-mono mb-2">{project.code}</p>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                {project.description}
              </p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Owner */}
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.owner.profileImage} />
                <AvatarFallback className="text-xs">
                  {project.owner.fullName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-600 dark:text-gray-400">
                {project.owner.fullName}
              </span>
            </div>

            {/* Members */}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{project.memberCount}명</span>
            </div>

            {/* Schedule */}
            {project.startDate && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.startDate)}
                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                </span>
              </div>
            )}

            {/* Days Remaining */}
            {project.daysRemaining !== undefined && (
              <div className={cn(
                "flex items-center gap-1",
                project.isOverdue ? "text-red-600" : "text-gray-600 dark:text-gray-400"
              )}>
                <Clock className="w-4 h-4" />
                <span>
                  {project.daysRemaining > 0 
                    ? `${project.daysRemaining}일 남음`
                    : '마감'}
                </span>
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">진행률</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRefresh}>
                새로고침
              </DropdownMenuItem>
              <DropdownMenuItem>
                복제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                보관
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}