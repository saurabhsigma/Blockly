"use client";

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import CodePreview from '@/components/CodePreview';
import OutputConsole from '@/components/OutputConsole';
import SaveProjectDialog from '@/components/dialogs/SaveProjectDialog';
import LoadProjectDialog from '@/components/dialogs/LoadProjectDialog';
import { Project } from '@/types/project';
import { getProjects, saveProject } from '@/lib/projectService';
import { executeJavaScript, executePython } from '@/lib/codeExecutor';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [blocklyXml, setBlocklyXml] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    clearOutput();
  };

  // Clear the output console
  const clearOutput = () => {
    setOutput('');
    setError('');
  };

  // Run the code
  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Nothing to run",
        description: "Create some blocks first to generate code",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    clearOutput();

    try {
      let result;
      
      if (language === 'javascript') {
        result = await executeJavaScript(code);
      } else {
        result = await executePython(code);
      }
      
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsExecuting(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    });
  };

  // Create a new project
  const handleNewProject = () => {
    setBlocklyXml(null);
    setCode('');
    clearOutput();
    toast({
      title: "New project created",
      description: `Started a new ${language === 'javascript' ? 'JavaScript' : 'Python'} project`,
    });
  };

  // Save a project
  const handleSaveProject = async (name: string) => {
    if (!blocklyXml) {
      toast({
        title: "Nothing to save",
        description: "Create some blocks first",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectData: Project = {
        name,
        language,
        blocklyXml,
        generatedCode: code,
      };

      await saveProject(projectData);
      
      toast({
        title: "Project saved",
        description: `"${name}" has been saved successfully`,
      });
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Save failed",
        description: "Could not save your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load a project
  const handleLoadProject = (project: Project) => {
    setLanguage(project.language);
    setBlocklyXml(project.blocklyXml);
    setCode(project.generatedCode);
    clearOutput();
    setIsLoadDialogOpen(false);
    
    toast({
      title: "Project loaded",
      description: `"${project.name}" has been loaded successfully`,
    });
  };

  // Fetch projects from the API
  const fetchProjects = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoadError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open the load dialog and fetch projects
  const handleOpenLoadDialog = () => {
    setIsLoadDialogOpen(true);
    fetchProjects();
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <TopBar
        onNewProject={handleNewProject}
        onSaveProject={() => setIsSaveDialogOpen(true)}
        onRunCode={handleRunCode}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane: Blockly workspace */}
        <div className="w-1/2 h-full flex-none">
          <BlocklyWorkspace
            language={language}
            onCodeChange={setCode}
            blocklyXml={blocklyXml}
            setBlocklyXml={setBlocklyXml}
          />
        </div>
        
        {/* Right pane: Code preview and output */}
        <div className="w-1/2 h-full flex flex-col">
          <div className="h-1/2">
            <CodePreview 
              code={code} 
              language={language} 
              onCopyCode={handleCopyCode}
            />
          </div>
          <div className="h-1/2 relative">
            <OutputConsole 
              output={output} 
              error={error} 
              onClear={clearOutput}
            />
            
            {isExecuting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
                  <p className="text-sm text-zinc-300">Executing {language} code...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <SaveProjectDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveProject}
      />
      
      <LoadProjectDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        onSelect={handleLoadProject}
        projects={projects}
        isLoading={isLoading}
        error={loadError}
      />
    </div>
  );
}