'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Switch } from '@/components/dashboard_UI/switch';
import { Button } from '@/components/dashboard_UI/button';
import { Label } from '@/components/dashboard_UI/label';
import { Bell, Mail, MessageSquare, Calendar } from 'lucide-react';
import SettingRow from '../shared/SettingRow';

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [calendarReminders, setCalendarReminders] = useState(true);

  const handleSave = () => {
    // 알림 설정 저장 로직
    console.log('알림 설정 저장됨');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            알림 설정
          </CardTitle>
          <CardDescription>
            받고 싶은 알림 유형을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SettingRow
            icon={<Mail className="w-5 h-5" />}
            title="이메일 알림"
            description="중요한 업데이트와 알림을 이메일로 받습니다"
          >
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </SettingRow>

          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="푸시 알림"
            description="브라우저 푸시 알림을 받습니다"
          >
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </SettingRow>

          <SettingRow
            icon={<MessageSquare className="w-5 h-5" />}
            title="SMS 알림"
            description="긴급한 알림을 SMS로 받습니다"
          >
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </SettingRow>

          <SettingRow
            icon={<Calendar className="w-5 h-5" />}
            title="캘린더 알림"
            description="일정 및 미팅 알림을 받습니다"
          >
            <Switch
              checked={calendarReminders}
              onCheckedChange={setCalendarReminders}
            />
          </SettingRow>

          <div className="pt-4 border-t">
            <Button onClick={handleSave}>
              변경사항 저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 