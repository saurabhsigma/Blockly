"use client";

import ProjectDialog from './ProjectDialog';
import { SaveProjectDialogProps } from '@/types/project';

export default function SaveProjectDialog({
  open,
  onOpenChange,
  onSave,
}: SaveProjectDialogProps) {
  return (
    <ProjectDialog
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      title="Save Project"
      description="Enter a name for your project. This will save your blocks and generated code."
      actionText="Save Project"
    />
  );
}