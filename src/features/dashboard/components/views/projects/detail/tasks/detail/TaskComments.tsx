// features/dashboard/components/views/projects/detail/tasks/detail/TaskComments.tsx

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { TaskComment } from '@/features/dashboard/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  Edit2, Trash2, Reply, MoreVertical, 
  Send, AtSign, Paperclip 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TaskCommentsProps {
  taskId: string;
  projectId: string;
}

export default function TaskComments({ taskId, projectId }: TaskCommentsProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // 댓글 목록 조회
  const { data: comments, isLoading } = useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      const response = await apiClient.get<TaskComment[]>(
        `/projects/${projectId}/tasks/${taskId}/comments/`
      );
      return response;
    },
  });

  // 댓글 작성
  const createComment = useMutation({
    mutationFn: async (data: { content: string; parent?: string }) => {
      return apiClient.post(
        `/projects/${projectId}/tasks/${taskId}/add_comment/`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      setNewComment('');
      setReplyTo(null);
    },
  });

  // 댓글 수정
  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      return apiClient.patch(
        `/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`,
        { content }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      setEditingComment(null);
      setEditContent('');
    },
  });

  // 댓글 삭제
  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      return apiClient.delete(
        `/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment.mutate({ content: newComment, parent: replyTo || undefined });
    }
  };

  const handleEdit = (comment: TaskComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateSubmit = (commentId: string) => {
    if (editContent.trim()) {
      updateComment.mutate({ commentId, content: editContent });
    }
  };

  const renderComment = (comment: TaskComment, isReply = false) => {
    const isEditing = editingComment === comment.id;
    const isAuthor = comment.user.id === user?.id;

    return (
      <div
        key={comment.id}
        className={cn(
          "flex gap-3",
          isReply && "ml-12 mt-3"
        )}
      >
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.user.profileImage} />
          <AvatarFallback className="text-xs">
            {comment.user.fullName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.user.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500">(수정됨)</span>
                )}
              </div>

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(comment)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteComment.mutate(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateSubmit(comment.id)}
                    disabled={updateComment.isPending}
                  >
                    저장
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
                
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {comment.mentions.map((mention) => (
                      <Badge key={mention.id} variant="secondary" className="text-xs">
                        @{mention.username}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {!isReply && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-xs text-gray-500 hover:text-gray-700 mt-1 flex items-center gap-1"
            >
              <Reply className="w-3 h-3" />
              답글
            </button>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.map((reply) => 
            renderComment(reply, true)
          )}

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3 ml-12">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="답글을 입력하세요..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm">
                  전송
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyTo(null);
                    setNewComment('');
                  }}
                >
                  취소
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Comment List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.filter(c => !c.parent).map((comment) => 
            renderComment(comment)
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          아직 댓글이 없습니다.
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="text-xs">
              {user?.fullName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="min-h-[80px] mb-2"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm">
                  <AtSign className="w-4 h-4 mr-1" />
                  멘션
                </Button>
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4 mr-1" />
                  첨부
                </Button>
              </div>
              
              <Button 
                type="submit" 
                size="sm"
                disabled={!newComment.trim() || createComment.isPending}
              >
                <Send className="w-4 h-4 mr-1" />
                전송
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}