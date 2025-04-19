"use client";

import { useState } from 'react';
import { FileCode, Save, Play, Plus, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onNewProject: () => void;
  onSaveProject: () => void;
  onRunCode: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function TopBar({
  onNewProject,
  onSaveProject,
  onRunCode,
  language,
  onLanguageChange,
}: TopBarProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  const handleRunClick = () => {
    setIsGlowing(true);
    onRunCode();
    setTimeout(() => setIsGlowing(false), 500);
  };

  return (
    <div className="flex items-center justify-between w-full h-16 px-4 border-b bg-black/80 backdrop-blur-sm border-white/10">
      <div className="flex items-center space-x-2">
        <FileCode className="h-6 w-6 text-purple-500" />
        <h1 className="text-xl font-bold text-white">Visual Code Platform</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-700 focus:ring-purple-500">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
          onClick={onNewProject}
        >
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
        
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
          onClick={onSaveProject}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        
        <Button
          variant="default"
          className={cn(
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all",
            isGlowing && "shadow-lg shadow-purple-500/50"
          )}
          onClick={handleRunClick}
        >
          <Play className="mr-2 h-4 w-4" />
          Run
        </Button>
        
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}