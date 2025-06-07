'use client';

import React from 'react';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { 
  Truck, Printer, Mail, Tag, FileText, 
  X, ChevronDown, Package, CheckCircle 
} from 'lucide-react';

interface OrdersBulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClear: () => void;
}

export default function OrdersBulkActions({ 
  selectedCount, 
  onAction, 
  onClear 
}: OrdersBulkActionsProps) {
  const actions = [
    {
      group: '배송 관리',
      items: [
        { 
          id: 'prepare_shipping', 
          label: '발송 준비', 
          icon: Package,
          description: '선택한 주문을 발송 준비 상태로 변경'
        },
        { 
          id: 'print_labels', 
          label: '송장 출력', 
          icon: Printer,
          description: '운송장 일괄 출력'
        },
        { 
          id: 'mark_shipped', 
          label: '발송 완료 처리', 
          icon: Truck,
          description: '택배사에 전달 완료'
        },
      ]
    },
    {
      group: '주문 관리',
      items: [
        { 
          id: 'confirm_orders', 
          label: '주문 확인', 
          icon: CheckCircle,
          description: '주문 확인 및 처리 시작'
        },
        { 
          id: 'add_tags', 
          label: '태그 추가', 
          icon: Tag,
          description: '급배, VIP 등 태그 추가'
        },
        { 
          id: 'add_memo', 
          label: '메모 추가', 
          icon: FileText,
          description: '내부 메모 일괄 추가'
        },
      ]
    },
    {
      group: '고객 커뮤니케이션',
      items: [
        { 
          id: 'send_tracking', 
          label: '송장번호 발송', 
          icon: Mail,
          description: '고객에게 배송 정보 전송'
        },
        { 
          id: 'send_message', 
          label: '메시지 발송', 
          icon: Mail,
          description: '고객에게 안내 메시지 발송'
        },
      ]
    },
  ];

  return (
    <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-base px-3 py-1">
            {selectedCount}개 선택됨
          </Badge>
          
          <div className="flex items-center gap-2">
            {actions.map((group) => (
              <DropdownMenu key={group.group}>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    {group.group}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {group.items.map((action, index) => (
                    <React.Fragment key={action.id}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        onClick={() => onAction(action.id)}
                        className="flex items-start gap-3 p-3"
                      >
                        <action.icon className="w-4 h-4 mt-0.5 text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">
                            {action.description}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-gray-600"
        >
          <X className="w-4 h-4 mr-1" />
          선택 해제
        </Button>
      </div>
    </Card>
  );
}