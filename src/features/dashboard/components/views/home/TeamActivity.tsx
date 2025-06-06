// features/dashboard/components/views/home/TeamActivity.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Badge } from '@/components/dashboard_UI/badge';
import { useWebSocket } from '@/features/dashboard/hooks/useWebSocket';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  currentTask?: string;
  department: string;
}

export default function TeamActivity() {
  const { subscribe } = useWebSocket();
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    {
      id: '1',
      name: '김철수',
      avatar: '/avatars/kim.jpg',
      status: 'online',
      currentTask: 'K-Tea 프로젝트 기획서 작성',
      department: '기획팀',
    },
    {
      id: '2',
      name: '이영희',
      avatar: '/avatars/lee.jpg',
      status: 'online',
      currentTask: '마케팅 캠페인 분석',
      department: '마케팅팀',
    },
    {
      id: '3',
      name: '박민수',
      status: 'away',
      department: '개발팀',
    },
    {
      id: '4',
      name: '정지은',
      status: 'offline',
      department: '디자인팀',
    },
  ]);

  React.useEffect(() => {
    const unsubscribe = subscribe('team:status', (data) => {
      setTeamMembers(prev => prev.map(member => 
        member.id === data.userId 
          ? { ...member, status: data.status, currentTask: data.currentTask }
          : member
      ));
    });

    return unsubscribe;
  }, [subscribe]);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return '온라인';
      case 'away': return '자리비움';
      case 'offline': return '오프라인';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>팀 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
                  getStatusColor(member.status)
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {member.name}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {member.department}
                  </Badge>
                </div>
                {member.currentTask ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {member.currentTask}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {getStatusLabel(member.status)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}