'use client';

import SettingsComponent from '../settings'; // 기존 SettingsComponent 사용

interface SettingsViewProps {
  onClose: () => void;
}

export default function SettingsView({ onClose }: SettingsViewProps) {
  return <SettingsComponent onClose={onClose} />;
} 