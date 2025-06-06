'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Card, CardContent } from '@/components/dashboard_UI/card';
import { 
  CheckCircle, MessageSquare, UserPlus, Edit, 
  Archive, Calendar, GitBranch, FileText 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: string;
  description: string;
  user: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  createdAt: string;
  metadata?: any;
}

interface ProjectActivityProps {
  projectId: string;
}

export default function ProjectActivity({ projectId }: ProjectActivityProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['project-activities', projectId],
    queryFn: async () => {
      // TODO: API 구현
      return [
        {
          id: '1',
          type: 'task_completed',
          description: '태스크 "UI 디자인 개선"을 완료했습니다',
          user: {
            id: '1',
            fullName: '김철수',
            profileImage: '/avatars/kim.jpg',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '2',
          type: 'member_added',
          description: '이영희님을 프로젝트에 초대했습니다',
          user: {
            id: '2',
            fullName: '박민수',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '3',
          type: 'comment_added',
          description: '태스크 "API 연동"에 댓글을 남겼습니다',
          user: {
            id: '3',
            fullName: '이영희',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
      ] as Activity[];
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'task_created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'member_added':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'status_changed':
        return <GitBranch className="w-4 h-4 text-yellow-600" />;
      case 'due_date_changed':
        return <Calendar className="w-4 h-4 text-orange-600" />;
      default:
        return <Edit className="w-4 h-4 text-gray-600" />;
    }
  };

  // 날짜별로 그룹화
  const groupedActivities = React.useMemo(() => {
    if (!activities) return {};
    
    const groups: Record<string, Activity[]> = {};
    activities.forEach(activity => {
      const date = new Date(activity.createdAt);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });
    
    return groups;
  }, [activities]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        활동 내역을 불러오는 중...
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            아직 활동 내역이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([dateKey, dateActivities]) => (
        <div key={dateKey}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            {formatDateHeader(dateKey)}
          </h3>
          
          <div className="space-y-4">
            {dateActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index < dateActivities.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user.fullName}</span>
                          {' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>
                      </div>
                      
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={activity.user.profileImage} />
                        <AvatarFallback className="text-xs">
                          {activity.user.fullName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}