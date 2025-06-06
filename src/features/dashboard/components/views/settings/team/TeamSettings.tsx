'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Badge } from '@/components/dashboard_UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Users, UserPlus, MoreHorizontal, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';

const teamMembers = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: 'Owner',
    avatar: null,
    status: 'active',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: 'Admin',
    avatar: null,
    status: 'active',
  },
  {
    id: '3',
    name: '박민수',
    email: 'park@example.com',
    role: 'Member',
    avatar: null,
    status: 'pending',
  },
];

export default function TeamSettings() {
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (inviteEmail) {
      console.log('초대 이메일 발송:', inviteEmail);
      setInviteEmail('');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'default';
      case 'Admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* 팀원 초대 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            팀원 초대
          </CardTitle>
          <CardDescription>
            새로운 팀원을 초대하여 협업하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="초대할 이메일 주소를 입력하세요"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleInvite}>
              <Mail className="w-4 h-4 mr-2" />
              초대 발송
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 팀원 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            팀원 관리
          </CardTitle>
          <CardDescription>
            현재 팀원들을 관리하고 권한을 설정하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status === 'active' ? '활성' : '대기중'}
                  </Badge>
                  
                  {member.role !== 'Owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>권한 변경</DropdownMenuItem>
                        <DropdownMenuItem>초대 재발송</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          팀에서 제거
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 