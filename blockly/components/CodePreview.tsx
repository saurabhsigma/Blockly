"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  language: string;
  className?: string;
  onCopyCode: () => void;
}

export default function CodePreview({ code, language, className, onCopyCode }: CodePreviewProps) {
  const preRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    // Highlight code when it changes
    if (typeof window !== 'undefined' && preRef.current) {
      import('highlight.js').then((hljs) => {
        if (preRef.current) {
          preRef.current.innerHTML = hljs.default.highlight(
            code,
            { language: language === 'javascript' ? 'javascript' : 'python' }
          ).value;
        }
      }).catch(err => {
        console.error('Failed to load highlight.js', err);
        if (preRef.current) {
          preRef.current.textContent = code;
        }
      });
    }
  }, [code, language]);

  return (
    <div className={cn("flex flex-col h-full bg-zinc-900 border-b border-white/10", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">
          Generated {language === 'javascript' ? 'JavaScript' : 'Python'} Code
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopyCode}
          className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre
          ref={preRef}
          className="text-sm font-mono text-zinc-300 whitespace-pre-wrap"
        >
          {code}
        </pre>
      </div>
    </div>
  );
}