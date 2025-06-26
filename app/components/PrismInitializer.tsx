'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';

// Import Prism language support
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

// Import line numbers plugin
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Import copy-to-clipboard plugin (optional)
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';

export function PrismInitializer() {
  useEffect(() => {
    // Initialize Prism
    Prism.highlightAll();
    
    // Add custom language definition for MultiversX Rust if needed
    Prism.languages.multiversx = Prism.languages.extend('rust', {
      // Add custom tokens for MultiversX-specific syntax
      'macro': {
        pattern: /#\[[^\]]+\]/,
        greedy: true
      },
      'attribute': {
        pattern: /(#\[)([^\]]+)(\])/,
        lookbehind: true,
        inside: {
          'string': /"(?:\\.|[^\\"])*"/,
          'punctuation': /[(),]/
        }
      }
    });
    
    // Register the custom language
    Prism.languages.mvc = Prism.languages.multiversx;
  }, []);

  return null;
}