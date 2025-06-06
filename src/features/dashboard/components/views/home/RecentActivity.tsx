// features/dashboard/components/views/home/RecentActivity.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Badge } from '@/components/dashboard_UI/badge';
import { 
  FileText, CheckCircle, MessageSquare, 
  UserPlus, Package, TrendingUp 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
// import { useQuery } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리

interface Activity {
  id: string;
  type: 'task_completed' | 'comment_added' | 'member_joined' | 'document_created' | 'order_received';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: any;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 데이터로 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'task_completed',
          title: '태스크 완료',
          description: 'E-커머스 플랫폼 개발 프로젝트의 "제품 기획서 작성" 태스크를 완료했습니다.',
          user: { name: '김철수', avatar: '/avatars/kim.jpg' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        },
        {
          id: '2',
          type: 'comment_added',
          title: '새 댓글',
          description: '"마케팅 전략 수립" 태스크에 댓글을 남겼습니다: "좋은 아이디어네요!"',
          user: { name: '이영희', avatar: '/avatars/lee.jpg' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
        },
        {
          id: '3',
          type: 'member_joined',
          title: '새 멤버 참여',
          description: '데이터 분석 시스템 프로젝트에 새로운 팀원으로 참여했습니다.',
          user: { name: '박민수' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
        },
        {
          id: '4',
          type: 'document_created',
          title: '문서 생성',
          description: '"API 명세서 v2.0" 문서를 새로 생성했습니다.',
          user: { name: '정하늘', avatar: '/avatars/jung.jpg' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8시간 전
        },
        {
          id: '5',
          type: 'order_received',
          title: '새 주문',
          description: '고객으로부터 ₩1,250,000 상당의 새로운 주문이 접수되었습니다.',
          user: { name: '시스템' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12시간 전
        },
      ];
      
      setActivities(mockActivities.slice(0, 4)); // 최근 4개만 표시
      setIsLoading(false);
    }, 600); // 0.6초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'member_joined':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'document_created':
        return <FileText className="w-4 h-4 text-yellow-600" />;
      case 'order_received':
        return <Package className="w-4 h-4 text-orange-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'comment_added':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'member_joined':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'document_created':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'order_received':
        return 'bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>
                    {activity.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <span className="font-medium text-sm">
                      {activity.user.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { 
                      addSuffix: true, 
                      locale: ko 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}