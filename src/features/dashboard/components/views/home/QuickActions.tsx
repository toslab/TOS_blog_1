// features/dashboard/components/views/home/QuickActions.tsx

'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { 
  Plus, FileText, Calendar, ShoppingBag, 
  Users, Package, Brain 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/dashboard_UI/dialog';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export default function QuickActions() {
  const router = useRouter();
  const [showNewProject, setShowNewProject] = React.useState(false);

  const actions: QuickAction[] = [
    {
      id: 'new-project',
      label: '새 프로젝트',
      icon: <Plus className="w-4 h-4" />,
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      onClick: () => setShowNewProject(true),
    },
    {
      id: 'new-document',
      label: '문서 작성',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: () => router.push('/dashboard/documents/new'),
    },
    {
      id: 'schedule-meeting',
      label: '미팅 예약',
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-green-600 hover:bg-green-700 text-white',
      onClick: () => router.push('/dashboard/calendar/new'),
    },
    {
      id: 'add-product',
      label: '상품 등록',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      onClick: () => router.push('/dashboard/ecommerce/products/new'),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={action.onClick}
            className={`gap-2 ${action.color}`}
            size="sm"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 프로젝트 만들기</DialogTitle>
            <DialogDescription>
              프로젝트 정보를 입력하여 새로운 프로젝트를 시작하세요.
            </DialogDescription>
          </DialogHeader>
          {/* TODO: 프로젝트 생성 폼 */}
        </DialogContent>
      </Dialog>
    </>
  );
}