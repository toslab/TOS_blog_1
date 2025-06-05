// features/dashboard/components/views/home/DashboardView.tsx

'use client';

import React from 'react';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import ProjectsOverview from './ProjectsOverview';
import TasksWidget from './TasksWidget';
import UpcomingEvents from './UpcomingEvents';
import QuickActions from './QuickActions';
import RevenueChart from './RevenueChart';
import TeamActivity from './TeamActivity';

export default function DashboardView() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          안녕하세요, {user?.fullName || user?.username}님 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          오늘의 업무 현황을 확인하세요
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <RevenueChart />
          
          {/* Projects Overview */}
          <ProjectsOverview />
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Right Column - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Tasks Widget */}
          <TasksWidget />
          
          {/* Upcoming Events */}
          <UpcomingEvents />
          
          {/* Team Activity */}
          <TeamActivity />
        </div>
      </div>
    </div>
  );
}