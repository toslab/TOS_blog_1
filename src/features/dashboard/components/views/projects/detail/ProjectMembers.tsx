'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ProjectMember } from '@/features/dashboard/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Label } from '@/components/dashboard_UI/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dashboard_UI/dialog';
import { 
  UserPlus, Shield, Crown, Eye, MoreVertical,
  Mail, Calendar, Settings 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { formatDate } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ProjectMembersProps {
  projectId: string;
}

export default function ProjectMembers({ projectId }: ProjectMembersProps) {
  const queryClient = useQueryClient();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('member');

  // 멤버 목록 조회
  const { data: members, isLoading } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const response = await apiClient.get<ProjectMember[]>(
        `/projects/${projectId}/members/`
      );
      return response;
    },
  });

  // 멤버 초대
  const inviteMember = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      return apiClient.post(`/projects/${projectId}/add_member/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('member');
    },
  });

  // 멤버 역할 변경
  const updateMemberRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiClient.patch(`/projects/${projectId}/update_member_role/`, {
        user_id: userId,
        role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
    },
  });

  // 멤버 제거
  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.post(`/projects/${projectId}/remove_member/`, {
        user_id: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'approver': return <Shield className="w-4 h-4" />;
      case 'member': return null;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return '소유자';
      case 'approver': return '승인자';
      case 'member': return '멤버';
      case 'viewer': return '뷰어';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'approver': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'member': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'viewer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">프로젝트 멤버</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            프로젝트에 참여하는 팀 멤버를 관리합니다
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          멤버 초대
        </Button>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            로딩 중...
          </div>
        ) : members?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">
                아직 멤버가 없습니다.
              </p>
              <Button onClick={() => setInviteDialogOpen(true)}>
                첫 멤버 초대하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          members?.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.user.profileImage} />
                      <AvatarFallback>
                        {member.user.fullName?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {member.user.fullName}
                        </h4>
                        <Badge className={cn("gap-1", getRoleColor(member.role))}>
                          {getRoleIcon(member.role)}
                          {getRoleLabel(member.role)}
                        </Badge>
                        {!member.isActive && (
                          <Badge variant="secondary">비활성</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(new Date(member.joinedAt), 'yyyy년 MM월 dd일', { locale: ko })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {member.role !== 'owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          권한 설정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => updateMemberRole.mutate({
                            userId: member.user.id,
                            role: member.role === 'member' ? 'approver' : 'member'
                          })}
                        >
                          역할 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => removeMember.mutate(member.user.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          멤버 제거
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로젝트 멤버 초대</DialogTitle>
            <DialogDescription>
              이메일 주소로 새로운 멤버를 프로젝트에 초대합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approver">승인자</SelectItem>
                  <SelectItem value="member">멤버</SelectItem>
                  <SelectItem value="viewer">뷰어</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={() => inviteMember.mutate({ email: inviteEmail, role: inviteRole })}
              disabled={!inviteEmail || inviteMember.isPending}
            >
              {inviteMember.isPending ? '초대 중...' : '초대하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}