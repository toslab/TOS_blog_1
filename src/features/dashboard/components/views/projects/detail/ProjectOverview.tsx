'use client';

import React from 'react';
import { Project, Task } from '@/features/dashboard/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Progress } from '@/components/dashboard_UI/progress';
import { 
  CheckCircle2, Clock, AlertCircle, Users, 
  Calendar, TrendingUp, Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
}

export default function ProjectOverview({ project, tasks }: ProjectOverviewProps) {
  // 태스크 통계 계산
  const taskStats = React.useMemo(() => {
    const stats = {
      total: tasks.length,
      byStatus: {
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        done: tasks.filter(t => t.status === 'done').length,
      },
      byPriority: {
        urgent: tasks.filter(t => t.priority === 'urgent').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
      },
      overdue: tasks.filter(t => t.isOverdue).length,
      blocked: tasks.filter(t => t.isBlocked).length,
    };
    return stats;
  }, [tasks]);

  // 차트 데이터
  const statusChartData = [
    { name: '할 일', value: taskStats.byStatus.todo, fill: '#9CA3AF' },
    { name: '진행 중', value: taskStats.byStatus.in_progress, fill: '#3B82F6' },
    { name: '검토', value: taskStats.byStatus.review, fill: '#F59E0B' },
    { name: '완료', value: taskStats.byStatus.done, fill: '#10B981' },
  ];

  const priorityChartData = [
    { name: '긴급', value: taskStats.byPriority.urgent, fill: '#EF4444' },
    { name: '높음', value: taskStats.byPriority.high, fill: '#F97316' },
    { name: '보통', value: taskStats.byPriority.medium, fill: '#F59E0B' },
    { name: '낮음', value: taskStats.byPriority.low, fill: '#10B981' },
  ];

  // 팀 멤버별 태스크
  const memberTasks = React.useMemo(() => {
    const tasksByMember: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.assignee) {
        const name = task.assignee.fullName || task.assignee.username;
        tasksByMember[name] = (tasksByMember[name] || 0) + 1;
      } else {
        tasksByMember['미할당'] = (tasksByMember['미할당'] || 0) + 1;
      }
    });
    return Object.entries(tasksByMember)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>프로젝트 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                전체 진행률
              </div>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <Progress value={project.progress} className="h-2 mt-2" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Activity className="w-4 h-4" />
                총 태스크
              </div>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <div className="text-sm text-gray-500 mt-1">
                완료: {taskStats.byStatus.done}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Users className="w-4 h-4" />
                팀 멤버
              </div>
              <div className="text-2xl font-bold">{project.memberCount}</div>
              <div className="text-sm text-gray-500 mt-1">
                활성: {project.memberCount}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                남은 기간
              </div>
              <div className={cn(
                "text-2xl font-bold",
                project.isOverdue && "text-red-600"
              )}>
                {project.daysRemaining ? `${project.daysRemaining}일` : '마감'}
              </div>
              {project.isOverdue && (
                <div className="text-sm text-red-600 mt-1">초과됨</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>태스크 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {statusChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>우선순위 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {priorityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Issues */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>마감 초과</span>
              </div>
              <span className="font-medium">{taskStats.overdue}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-4 h-4" />
                <span>차단됨</span>
              </div>
              <span className="font-medium">{taskStats.blocked}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>팀 성과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memberTasks.map((member) => (
              <div key={member.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {member.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress 
                    value={(member.count / taskStats.total) * 100} 
                    className="w-32 h-2"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                    {member.count} 태스크
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}