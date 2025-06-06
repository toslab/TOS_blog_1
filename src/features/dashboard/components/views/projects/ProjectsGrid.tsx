// features/dashboard/components/views/projects/ProjectsGrid.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/features/dashboard/types';
import { Card, CardContent, CardHeader } from '@/components/dashboard_UI/card';
import { Badge } from '@/components/dashboard_UI/badge';
import { Progress } from '@/components/dashboard_UI/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Users, Calendar, MoreVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/dashboard_UI/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';

interface ProjectsGridProps {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectsGrid({ projects, onRefresh }: ProjectsGridProps) {
  const getStatusColor = (status: Project['status']) => {
    const colors = {
      planning: 'bg-blue-500',
      active: 'bg-green-500',
      on_hold: 'bg-yellow-500',
      completed: 'bg-gray-500',
      archived: 'bg-gray-400',
    };
    return colors[status] || colors.planning;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-1 h-full absolute left-0 top-0 ${getStatusColor(project.status)}`} />
                <Link 
                  href={`/dashboard/projects/${project.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-1"
                >
                  {project.name}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {project.code}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>수정</DropdownMenuItem>
                  <DropdownMenuItem>보관</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Description */}
            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
            )}
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">진행률</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{project.memberCount}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{project.daysRemaining ? `D-${project.daysRemaining}` : '마감'}</span>
              </div>
            </div>
            
            {/* Owner */}
            <div className="flex items-center justify-between pt-3 border-t">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.owner.profileImage} />
                <AvatarFallback className="text-xs">
                  {project.owner.fullName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Badge variant="outline" className="text-xs">
                {project.myRole === 'owner' ? '소유자' : 
                 project.myRole === 'approver' ? '승인자' :
                 project.myRole === 'member' ? '멤버' : '뷰어'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}