import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-rust'; // Import Rust language support
import 'prismjs/components/prism-solidity'; // Import Solidity language support (for comparison)
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Define the props interface for our component
interface CodePreviewProps {
  code: string;
  language?: string;  // Optional prop for syntax highlighting language
  showCopyButton?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ 
  code, 
  language = 'rust',  // Default to Rust syntax highlighting for MultiversX
  showCopyButton = true,
  showLineNumbers = true,
  className = ''
}) => {
  // Define the type for our ref
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only highlight if we have a valid code element
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]); // Re-run when code changes

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard');
    }
  };

  // Function to add line numbers
  const codeWithLineNumbers = () => {
    if (!showLineNumbers || !code) return code;
    
    return code.split('\n').map((line, i) => (
      `<span class="line-number">${i + 1}</span>${line}`
    )).join('\n');
  };

  return (
    <div className={`relative h-full ${className}`}>
      {showCopyButton && code && (
        <Button 
          onClick={copyToClipboard}
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 z-10 bg-gray-800/80 border-gray-700 hover:bg-gray-700"
          title="Copy code"
        >
          <Copy className="h-4 w-4 text-gray-300" />
        </Button>
      )}
      <div className="h-full overflow-auto custom-scrollbar">
        <pre className="p-4 rounded-lg text-sm bg-gray-900 min-h-full">
          <code 
            ref={codeRef} 
            className={`language-${language} ${showLineNumbers ? 'line-numbers' : ''}`}
          >
            {code || '// No code generated yet'}
          </code>
        </pre>
      </div>
    </div>
  );
};