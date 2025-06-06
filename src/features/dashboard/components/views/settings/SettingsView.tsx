'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { 
  User, Lock, Bell, CreditCard, Users, Shield,
  ChevronDown
} from 'lucide-react';
import ProfileSettings from './account/ProfileSettings';
import SecuritySettings from './security/SecuritySettings';
import NotificationSettings from './notifications/NotificationSettings';
import SubscriptionSettings from './billing/SubscriptionSettings';
import BillingSettings from './billing/BillingSettings';
import TeamSettings from './team/TeamSettings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';

const settingsTabs = [
  { id: 'profile', name: '프로필', icon: User, component: ProfileSettings },
  { id: 'security', name: '보안', icon: Lock, component: SecuritySettings },
  { id: 'notifications', name: '알림', icon: Bell, component: NotificationSettings },
  { id: 'subscription', name: '구독', icon: Shield, component: SubscriptionSettings },
  { id: 'billing', name: '결제', icon: CreditCard, component: BillingSettings },
  { id: 'team', name: '팀', icon: Users, component: TeamSettings },
];

export default function SettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/settings?tab=${value}`);
  };

  const ActiveComponent = settingsTabs.find(tab => tab.id === activeTab)?.component || ProfileSettings;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">설정</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          계정 설정 및 환경설정을 관리하세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        {/* Mobile Tab Selector */}
        <div className="lg:hidden">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settingsTabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="hidden lg:flex w-full justify-start border-b bg-transparent p-0 h-auto">
            {settingsTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-1 pb-4 pt-2 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <ActiveComponent />
          </div>
        </Tabs>
      </div>
    </div>
  );
}