/**
 * Project type definitions
 */

export interface Project {
  _id?: string;
  name: string;
  language: string;
  blocklyXml: string;
  generatedCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  defaultValue?: string;
  title: string;
  description: string;
  actionText: string;
}

export interface LoadProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (project: Project) => void;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
}