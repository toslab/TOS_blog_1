// features/dashboard/components/layout/header/NotificationButton.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { ScrollArea } from '@/components/dashboard_UI/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { 
  Bell, Check, CheckCheck, Settings, 
  MessageSquare, UserPlus, AlertCircle,
  Calendar, FileText, Zap, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MockNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  related_object_url?: string;
  metadata: Record<string, any>;
}

// 모킹된 알림 데이터
const mockNotifications: MockNotification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: '새 태스크가 할당되었습니다',
    message: '김철수님이 "K-Tea 프로젝트 기획서 작성" 태스크를 할당했습니다.',
    priority: 'high',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
    sender: {
      id: '1',
      name: '김철수',
      avatar: '/avatars/kim.jpg'
    },
    related_object_url: '/dashboard/projects/1',
    metadata: {
      project_name: 'K-Tea 프로젝트',
      task_id: '1'
    }
  },
  {
    id: '2',
    type: 'task_completed',
    title: '태스크가 완료되었습니다',
    message: '이영희님이 "마케팅 전략 수립" 태스크를 완료했습니다.',
    priority: 'normal',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    sender: {
      id: '2',
      name: '이영희',
      avatar: '/avatars/lee.jpg'
    },
    related_object_url: '/dashboard/projects/1',
    metadata: {
      project_name: 'K-Tea 프로젝트',
      task_id: '2'
    }
  },
  {
    id: '3',
    type: 'project_invited',
    title: '프로젝트에 초대되었습니다',
    message: '박민수님이 "Spotlight 개발" 프로젝트에 초대했습니다.',
    priority: 'high',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    sender: {
      id: '3',
      name: '박민수'
    },
    related_object_url: '/dashboard/projects/2',
    metadata: {
      project_name: 'Spotlight 개발'
    }
  },
  {
    id: '4',
    type: 'task_commented',
    title: '댓글이 작성되었습니다',
    message: '정지은님이 "UI/UX 개선" 태스크에 댓글을 남겼습니다.',
    priority: 'normal',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    sender: {
      id: '4',
      name: '정지은'
    },
    related_object_url: '/dashboard/projects/1',
    metadata: {
      project_name: 'K-Tea 프로젝트',
      task_id: '3'
    }
  },
  {
    id: '5',
    type: 'system_announcement',
    title: '시스템 업데이트 안내',
    message: '새로운 협업 기능이 추가되었습니다. 확인해보세요!',
    priority: 'normal',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    related_object_url: '/dashboard/updates',
    metadata: {
      version: '1.2.0'
    }
  }
];

export default function NotificationButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // 읽지 않은 알림 수 계산
  useEffect(() => {
    const count = notifications.filter(n => !n.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 새 알림 시뮬레이션 (개발용)
  useEffect(() => {
    const interval = setInterval(() => {
      // 5% 확률로 새 알림 생성
      if (Math.random() < 0.05) {
        const newNotification: MockNotification = {
          id: Date.now().toString(),
          type: 'task_assigned',
          title: '새 태스크 알림',
          message: '시뮬레이션된 새 알림입니다.',
          priority: 'normal',
          is_read: false,
          created_at: new Date().toISOString(),
          sender: {
            id: 'sim',
            name: '시스템'
          },
          related_object_url: '/dashboard/projects',
          metadata: {}
        };

        setNotifications(prev => [newNotification, ...prev]);

        // 브라우저 알림
        if (Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/icon-192x192.png',
          });
        }
      }
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_completed':
        return <CheckCheck className="w-4 h-4 text-blue-600" />;
      case 'task_overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'task_commented':
      case 'task_mentioned':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'project_invited':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'article_shared':
      case 'article_commented':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'system_announcement':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'normal':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleNotificationClick = (notification: MockNotification) => {
    // 읽음 처리
    if (!notification.is_read) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    }

    // 관련 페이지로 이동
    if (notification.related_object_url) {
      router.push(notification.related_object_url);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ 
        ...n, 
        is_read: true, 
        read_at: n.read_at || new Date().toISOString() 
      }))
    );
  };

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">알림</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                모두 읽음
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                router.push('/dashboard/settings/notifications');
                setIsOpen(false);
              }}
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">알림이 없습니다</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer border-l-4 hover:bg-gray-50 dark:hover:bg-gray-800 group relative",
                    getPriorityColor(notification.priority),
                    !notification.is_read && "bg-blue-50 dark:bg-blue-950/20"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {notification.sender ? (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={notification.sender.avatar} />
                        <AvatarFallback className="text-xs">
                          {notification.sender.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium line-clamp-1">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="justify-center text-sm text-blue-600 hover:text-blue-700"
              onClick={() => {
                router.push('/dashboard/notifications');
                setIsOpen(false);
              }}
            >
              모든 알림 보기
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}