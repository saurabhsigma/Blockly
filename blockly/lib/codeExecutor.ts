/**
 * Code execution utilities for running JavaScript and Python code
 */

// JavaScript code executor using browser eval
export const executeJavaScript = (code: string): Promise<{ output: string; error: string }> => {
  return new Promise((resolve) => {
    const output: string[] = [];
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    // Capture console output
    console.log = (...args) => {
      const formatted = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      output.push(formatted);
      originalConsoleLog.apply(console, args);
    };

    console.error = (...args) => {
      const formatted = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      output.push(formatted);
      originalConsoleError.apply(console, args);
    };

    try {
      // Execute the code
      eval(code);
      resolve({ output: output.join('\n'), error: '' });
    } catch (err) {
      resolve({ output: output.join('\n'), error: err instanceof Error ? err.toString() : String(err) });
    } finally {
      // Restore original console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    }
  });
};

// Python code executor using Brython
export const executePython = async (code: string): Promise<{ output: string; error: string }> => {
  // Check if Brython is available
  if (typeof window === 'undefined' || !window.brython) {
    await loadBrython();
  }

  return new Promise((resolve) => {
    const output: string[] = [];
    let error = '';

    try {
      // Create a container for Brython output
      const outputContainer = document.createElement('div');
      outputContainer.style.display = 'none';
      document.body.appendChild(outputContainer);

      // Redirect Python's sys.stdout to our custom output
      const pythonCode = `
import sys
from browser import document, console

class OutputCatcher:
    def __init__(self):
        self.content = ""
    
    def write(self, text):
        self.content += text
    
    def flush(self):
        pass

sys.stdout = OutputCatcher()
sys.stderr = OutputCatcher()

try:
${code}
except Exception as e:
    sys.stderr.write(str(e))

# Return the captured output
document._output = sys.stdout.content
document._error = sys.stderr.content
`;

      // Execute the Python code
      window.__BRYTHON__.runPython(pythonCode);

      // Get the output from the document
      if (document._output) {
        output.push(document._output);
      }
      
      if (document._error) {
        error = document._error;
      }

      // Cleanup
      document.body.removeChild(outputContainer);
      delete document._output;
      delete document._error;

      resolve({ output: output.join('\n'), error });
    } catch (err) {
      resolve({ output: output.join('\n'), error: err instanceof Error ? err.toString() : String(err) });
    }
  });
};

// Load Brython dynamically if needed
async function loadBrython() {
  if (typeof window !== 'undefined' && !window.brython) {
    return new Promise<void>((resolve, reject) => {
      // Load Brython script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/brython@3.11.2/brython.min.js';
      script.onload = () => {
        // Also load Brython stdlib
        const stdlibScript = document.createElement('script');
        stdlibScript.src = 'https://cdn.jsdelivr.net/npm/brython@3.11.2/brython_stdlib.js';
        stdlibScript.onload = () => {
          // Initialize Brython
          window.brython();
          resolve();
        };
        stdlibScript.onerror = reject;
        document.head.appendChild(stdlibScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return Promise.resolve();
}