// src/features/dashboard/components/views/settings/account/ProfileSettings.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';
import { Button } from '@/components/dashboard_UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Input } from '@/components/dashboard_UI/input';
import { Label } from '@/components/dashboard_UI/label';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Switch } from '@/components/dashboard_UI/switch';
import { Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SettingRow from '@/features/dashboard/components/views/settings/shared/SettingRow';
import EditableRow from '@/features/dashboard/components/views/settings/shared/EditableRow';

const profileSchema = z.object({
  firstName: z.string().min(1, '이름을 입력해주세요'),
  lastName: z.string().min(1, '성을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  username: z.string().min(3, '사용자명은 3자 이상이어야 합니다'),
  bio: z.string().max(500, '자기소개는 500자 이내로 작성해주세요').optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  language: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user } = useAuth();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [automaticTimezone, setAutomaticTimezone] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: user?.bio || '',
      department: user?.department || '',
      position: user?.position || '',
      language: 'ko',
      timezone: 'Asia/Seoul',
      dateFormat: 'YYYY-MM-DD',
    },
  });

  // 로컬에서 프로필 업데이트 시뮬레이션
  const updateProfile = {
    mutate: async (data: Partial<ProfileFormData>) => {
      setIsUpdating(true);
      
      // 업데이트 시뮬레이션 (1초 대기)
      setTimeout(() => {
        console.log('프로필 업데이트:', data);
        setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
        setEditingField(null);
        setIsUpdating(false);
        
        // 3초 후 메시지 제거
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 1000);
    },
    isPending: isUpdating,
  };

  // 아바타 업로드 시뮬레이션
  const uploadAvatar = {
    mutate: async (file: File) => {
      setIsUploading(true);
      
      // 업로드 시뮬레이션 (2초 대기)
      setTimeout(() => {
        console.log('아바타 업로드:', file.name);
        setSuccessMessage('프로필 사진이 성공적으로 업데이트되었습니다.');
        setProfileImage(null);
        setIsUploading(false);
        
        // 3초 후 메시지 제거
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 2000);
    },
    isPending: isUploading,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      uploadAvatar.mutate(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg border p-4 border-green-200 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="text-sm text-green-800 dark:text-green-200">
              {successMessage}
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">프로필</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            다른 사용자에게 표시되는 공개 정보입니다.
          </p>
        </div>
        
        <div className="mt-6">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Name */}
            <EditableRow
              field="firstName"
              label="이름"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            <EditableRow
              field="lastName"
              label="성"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            
            {/* Photo */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                프로필 사진
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <span className="flex-grow">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>
                      {user?.fullName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </span>
                <span className="ml-4 flex-shrink-0 flex items-start gap-4">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      {isUploading ? '업로드 중...' : '변경'}
                    </span>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isUploading}
                    />
                  </Label>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      console.log('프로필 사진 삭제');
                      setSuccessMessage('프로필 사진이 삭제되었습니다.');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                  >
                    삭제
                  </Button>
                </span>
              </dd>
            </div>
            
            {/* Email */}
            <EditableRow
              field="email"
              label="이메일"
              type="email"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            
            {/* Username */}
            <EditableRow
              field="username"
              label="사용자명"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            
            {/* Department & Position */}
            <EditableRow
              field="department"
              label="부서"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            <EditableRow
              field="position"
              label="직책"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
            
            {/* Bio */}
            <EditableRow
              field="bio"
              label="자기소개"
              type="textarea"
              form={form}
              editingField={editingField}
              setEditingField={setEditingField}
              updateMutation={updateProfile}
            />
          </dl>
        </div>
      </div>

      {/* Account Section */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">계정</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            계정 표시 방법을 관리합니다.
          </p>
        </div>
        
        <div className="mt-6">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Language */}
            <SettingRow
              label="언어"
              value="한국어"
              onUpdate={() => {
                console.log('언어 변경');
                setSuccessMessage('언어 설정이 변경되었습니다.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
            />
            
            {/* Date Format */}
            <SettingRow
              label="날짜 형식"
              value="YYYY-MM-DD"
              onUpdate={() => {
                console.log('날짜 형식 변경');
                setSuccessMessage('날짜 형식이 변경되었습니다.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
            />
            
            {/* Automatic Timezone */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                자동 시간대
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <Switch
                  checked={automaticTimezone}
                  onCheckedChange={(checked) => {
                    setAutomaticTimezone(checked);
                    console.log('자동 시간대:', checked);
                  }}
                  className="ml-auto"
                />
              </dd>
            </div>
            
            {/* Timezone */}
            {!automaticTimezone && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  시간대
                </dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">
                  <Select defaultValue="Asia/Seoul" onValueChange={(value) => {
                    console.log('시간대 변경:', value);
                    setSuccessMessage('시간대가 변경되었습니다.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">
                        (UTC+09:00) 서울
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        (UTC+09:00) 도쿄
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        (UTC-05:00) 뉴욕
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        (UTC+00:00) 런던
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}