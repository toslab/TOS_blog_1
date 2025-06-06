'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { Briefcase, Plus, FileText, Users } from 'lucide-react';

interface ProjectsEmptyProps {
  onCreate: () => void;
}

export default function ProjectsEmpty({ onCreate }: ProjectsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Briefcase className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        프로젝트가 없습니다
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        첫 프로젝트를 만들어 팀과 함께 목표를 달성해보세요.
        프로젝트를 통해 업무를 체계적으로 관리할 수 있습니다.
      </p>

      <Button onClick={onCreate} size="lg" className="mb-8">
        <Plus className="w-5 h-5 mr-2" />
        새 프로젝트 만들기
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-medium mb-2">체계적인 업무 관리</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            태스크, 일정, 문서를 한 곳에서 관리하세요
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium mb-2">실시간 협업</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            팀원들과 실시간으로 소통하고 협업하세요
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-medium mb-2">진행 상황 추적</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            프로젝트 진행률을 한눈에 파악하세요
          </p>
        </div>
      </div>
    </div>
  );
}