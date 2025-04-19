"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoadProjectDialogProps, Project } from '@/types/project';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Code2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function LoadProjectDialog({
  open,
  onOpenChange,
  onSelect,
  projects,
  isLoading,
  error,
}: LoadProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Load Project</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Select a project to load from your saved projects
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
            <p className="text-zinc-400">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <p className="text-red-400 mb-2">Failed to load projects</p>
            <p className="text-zinc-500 text-sm">{error}</p>
            <Button
              className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <p className="text-zinc-400 mb-2">No saved projects found</p>
            <p className="text-zinc-500 text-sm">Create and save a project to see it here</p>
            <Button
              className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {projects.map((project) => (
                <ProjectItem 
                  key={project._id} 
                  project={project} 
                  onSelect={onSelect} 
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProjectItem({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const createdAt = project.createdAt 
    ? format(new Date(project.createdAt), 'MMM d, yyyy') 
    : 'Unknown date';
  
  return (
    <button
      className="w-full text-left p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white truncate">{project.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300 uppercase">
          {project.language}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-zinc-400 mt-1">
        <Calendar className="h-3 w-3 mr-1" />
        <span className="mr-3">{createdAt}</span>
        <Code2 className="h-3 w-3 mr-1" />
        <span>{project.generatedCode.split('\n').length} lines</span>
      </div>
    </button>
  );
}