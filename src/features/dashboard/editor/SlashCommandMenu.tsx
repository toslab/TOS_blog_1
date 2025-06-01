'use client';

import React from 'react';
import { useEditor2 } from '../../../app/dashboard/contexts/EditorContext';
import SlashCommands from '../../../app/dashboard/components/slash-commands';

export default function SlashCommandMenu() {
  const {
    editor,
    slashCommandOpen,
    slashCommandPosition,
    setSlashCommandOpen,
    slashCommand,
    handleSlashCommandSelect,
  } = useEditor2();

  if (!editor || !slashCommandOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: `${slashCommandPosition.top}px`,
        left: `${slashCommandPosition.left}px`,
        zIndex: 50,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <SlashCommands
        editor={editor}
        isOpen={slashCommandOpen}
        setIsOpen={setSlashCommandOpen}
        command={slashCommand}
        onSelect={handleSlashCommandSelect}
      />
    </div>
  );
} 