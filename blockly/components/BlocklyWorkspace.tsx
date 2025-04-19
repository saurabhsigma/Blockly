"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BlocklyWorkspaceProps {
  language: 'javascript' | 'python';
  onCodeChange: (code: string) => void;
  blocklyXml: string | null;
  setBlocklyXml: (xml: string) => void;
  className?: string;
}

export default function BlocklyWorkspace({
  language,
  onCodeChange,
  blocklyXml,
  setBlocklyXml,
  className
}: BlocklyWorkspaceProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<ReturnType<any> | null>(null);
  const isInitializedRef = useRef(false);
  const changeListenerRef = useRef<((event: any) => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeBlockly = async () => {
      if (typeof window === 'undefined' || !blocklyDiv.current) return;

      const Blockly = await import('blockly');
      const { Themes, Xml, inject } = Blockly;

      let generator: any = null;
      if (language === 'javascript') {
        const { javascriptGenerator } = await import('blockly/javascript');
        generator = javascriptGenerator;
      } else if (language === 'python') {
        const { pythonGenerator } = await import('blockly/python');
        generator = pythonGenerator;
      }

      const toolbox = {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: 'Logic',
            colour: '#5C81A6',
            contents: [
              { kind: 'block', type: 'controls_if' },
              { kind: 'block', type: 'logic_compare' },
              { kind: 'block', type: 'logic_operation' },
              { kind: 'block', type: 'logic_negate' },
              { kind: 'block', type: 'logic_boolean' },
            ],
          },
          {
            kind: 'category',
            name: 'Loops',
            colour: '#5CA65C',
            contents: [
              { kind: 'block', type: 'controls_repeat_ext' },
              { kind: 'block', type: 'controls_whileUntil' },
              { kind: 'block', type: 'controls_for' },
              { kind: 'block', type: 'controls_forEach' },
            ],
          },
          {
            kind: 'category',
            name: 'Math',
            colour: '#5C68A6',
            contents: [
              { kind: 'block', type: 'math_number' },
              { kind: 'block', type: 'math_arithmetic' },
              { kind: 'block', type: 'math_single' },
              { kind: 'block', type: 'math_random_int' },
            ],
          },
          {
            kind: 'category',
            name: 'Text',
            colour: '#A65C94',
            contents: [
              { kind: 'block', type: 'text' },
              { kind: 'block', type: 'text_join' },
              { kind: 'block', type: 'text_append' },
              { kind: 'block', type: 'text_length' },
            ],
          },
          {
            kind: 'category',
            name: 'Variables',
            colour: '#A65C81',
            custom: 'VARIABLE',
          },
          {
            kind: 'category',
            name: 'Functions',
            colour: '#9A5CA6',
            custom: 'PROCEDURE',
          },
        ],
      };

      if (workspaceRef.current && isInitializedRef.current) {
        workspaceRef.current.dispose();
      }

      workspaceRef.current = inject(blocklyDiv.current, {
        toolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#333',
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        // theme: Themes.Dark,
        renderer: 'zelos',
        move: {
          scrollbars: { horizontal: true, vertical: true },
          drag: true,
          wheel: true,
        },
        trashcan: true,
      });

      isInitializedRef.current = true;

      if (blocklyXml) {
        try {
          const xml = Xml.textToDom(blocklyXml);
          Xml.domToWorkspace(xml, workspaceRef.current);
        } catch (e) {
          console.error('Failed to restore XML blocks:', e);
        }
      }

      const updateCode = () => {
        if (!generator || !workspaceRef.current) return;

        try {
          const code = generator.workspaceToCode(workspaceRef.current);
          onCodeChange(code);

          const xml = Xml.workspaceToDom(workspaceRef.current);
          const xmlText = Xml.domToText(xml);
          setBlocklyXml(xmlText);
        } catch (err) {
          console.error('Error generating code:', err);
        }
      };

      if (workspaceRef.current) {
        changeListenerRef.current = updateCode;
        workspaceRef.current.addChangeListener(changeListenerRef.current);
        updateCode();
      }
    };

    initializeBlockly();

    return () => {
      isMounted = false;
      if (workspaceRef.current && isInitializedRef.current) {
        try {
          if (changeListenerRef.current) {
            workspaceRef.current.removeChangeListener(changeListenerRef.current);
          }
          workspaceRef.current.dispose();
        } catch (e) {
          console.warn('Error during Blockly cleanup:', e);
        }
      }
    };
  }, [language]);

  return (
    <div className={cn("relative h-full", className)}>
      <div
        ref={blocklyDiv}
        className="absolute inset-0 bg-zinc-900 border-r border-white/10"
        style={{ width: '100%', height: '100%' }}
      />
      <style jsx global>{`
        .blocklyMainBackground {
          stroke: none !important;
        }
        .blocklyToolboxDiv {
          background-color: #111111 !important;
          color: white !important;
        }
        .blocklyTreeRow {
          height: 32px !important;
          line-height: 32px !important;
          padding-left: 12px !important;
        }
        .blocklyTreeLabel {
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .blocklyFlyout {
          background-color: #252525 !important;
        }
        .blocklyScrollbarHandle {
          fill: #4d4d4d !important;
        }
        .blocklyZoom {
          fill: #666 !important;
        }
        .blocklyZoom > image {
          opacity: 0.6 !important;
        }
        .blocklyZoom:hover > image {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
