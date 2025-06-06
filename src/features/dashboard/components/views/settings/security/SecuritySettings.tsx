// src/features/dashboard/components/views/settings/security/SecuritySettings.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Label } from '@/components/dashboard_UI/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/dashboard_UI/card';
import { Badge } from '@/components/dashboard_UI/badge';
import { Switch } from '@/components/dashboard_UI/switch';
import { Shield, AlertCircle, CheckCircle2, Eye, EyeOff, Smartphone, Monitor } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 간단한 Alert 컴포넌트
const Alert = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

// 임시 컴포넌트들
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { text: '매우 약함', color: 'bg-red-500' },
      { text: '약함', color: 'bg-orange-500' },
      { text: '보통', color: 'bg-yellow-500' },
      { text: '강함', color: 'bg-green-500' },
      { text: '매우 강함', color: 'bg-green-600' }
    ];
    
    return { score, ...levels[score] };
  };

  const strength = getStrength(password);
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i < strength.score ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-sm text-gray-600">
          비밀번호 강도: {strength.text}
        </p>
      )}
    </div>
  );
};

const TwoFactorAuth = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          2단계 인증
        </CardTitle>
        <CardDescription>
          계정 보안을 강화하기 위해 2단계 인증을 설정하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">2단계 인증 활성화</p>
            <p className="text-sm text-gray-600">
              SMS 또는 인증 앱을 통한 추가 보안 인증
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>
        
        {isEnabled && (
          <div className="pt-4 border-t">
            <Button variant="outline">
              인증 앱 설정
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LoginHistory = () => {
  const loginSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: '서울, 한국',
      ip: '192.168.1.1',
      time: '2024-01-15 14:30',
      current: true,
    },
    {
      id: '2', 
      device: 'Safari on iPhone',
      location: '서울, 한국',
      ip: '192.168.1.2',
      time: '2024-01-14 09:15',
      current: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          로그인 기록
        </CardTitle>
        <CardDescription>
          최근 계정 접속 기록을 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loginSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current && (
                    <Badge variant="secondary">현재 세션</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {session.location} • {session.ip}
                </p>
                <p className="text-sm text-gray-500">{session.time}</p>
              </div>
              
              {!session.current && (
                <Button variant="outline" size="sm">
                  종료
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/[a-z]/, '소문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다')
    .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 로컬에서 비밀번호 업데이트 시뮬레이션
  const updatePassword = {
    mutate: async (data: PasswordFormData) => {
      setIsUpdating(true);
      
      // 업데이트 시뮬레이션 (2초 대기)
      setTimeout(() => {
        console.log('비밀번호 변경:', { 
          currentPassword: '***',
          newPassword: '***' 
        });
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        form.reset();
        setIsUpdating(false);
        
        // 5초 후 메시지 제거
        setTimeout(() => setSuccessMessage(''), 5000);
      }, 2000);
    },
    isPending: isUpdating,
  };

  const onSubmit = (data: PasswordFormData) => {
    updatePassword.mutate(data);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Password Change Form */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>
            계정 보안을 위해 정기적으로 비밀번호를 변경하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <div className="relative">
                <Input
                  {...form.register('currentPassword')}
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <div className="relative">
                <Input
                  {...form.register('newPassword')}
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              
              <PasswordStrengthIndicator password={form.watch('newPassword')} />
              
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <div className="relative">
                <Input
                  {...form.register('confirmPassword')}
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <TwoFactorAuth />

      {/* Login History */}
      <LoginHistory />
    </div>
  );
}