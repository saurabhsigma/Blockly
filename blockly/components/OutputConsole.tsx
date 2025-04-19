"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Terminal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputConsoleProps {
  output: string;
  error: string;
  className?: string;
  onClear: () => void;
}

export default function OutputConsole({ output, error, className, onClear }: OutputConsoleProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error]);

  return (
    <div className={cn("flex flex-col h-full bg-zinc-900", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-green-500" />
          <h3 className="text-sm font-medium text-white">Console Output</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm"
      >
        {output && (
          <div className="text-green-300 whitespace-pre-wrap mb-2">{output}</div>
        )}
        {error && (
          <div className="text-red-400 whitespace-pre-wrap">{error}</div>
        )}
        {!output && !error && (
          <div className="text-zinc-500 italic">Output will appear here when you run your code</div>
        )}
      </div>
    </div>
  );
}