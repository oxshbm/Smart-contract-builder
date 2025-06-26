declare module 'react-syntax-highlighter' {
    import { ReactNode } from 'react';
  
    export interface SyntaxHighlighterProps {
      language?: string;
      style?: { [key: string]: any };
      children: string | ReactNode;
      className?: string;
      customStyle?: object;
      codeTagProps?: object;
      showLineNumbers?: boolean;
      startingLineNumber?: number;
      lineNumberStyle?: object | ((lineNumber: number) => object);
      wrapLines?: boolean;
      lineProps?: object | ((lineNumber: number) => object);
    }
  
    export const Prism: React.FC<SyntaxHighlighterProps>;
    export const Light: React.FC<SyntaxHighlighterProps>;
  }
  
  declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
    export const materialOceanic: { [key: string]: any };
    export const tomorrow: { [key: string]: any };
    export const dark: { [key: string]: any };
    export const dracula: { [key: string]: any };
    // Add other styles you might use
  }