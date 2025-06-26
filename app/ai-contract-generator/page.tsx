'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Wand2, Download, Upload, AlertCircle, ArrowLeft, Code2, Github } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import DeploymentPanel from '@/app/components/DeploymentPanel';

// Type definitions
type StatusType = 'error' | 'success' | 'info' | null;

interface StatusState {
  type: StatusType;
  message: string | ReactNode;
}

const nullStatus: StatusState = {
  type: null,
  message: ''
};

export default function AIContractGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(nullStatus);
  const [showDeployment, setShowDeployment] = useState(false);

  // Cleanup code from API response - removes markdown code blocks
  const cleanupCodeResponse = (code: string) => {
    if (!code) return '';
    return code
      .replace(/```rust\n?|```$/g, '') // Remove ```rust and closing ```
      .trim();
  };

  // Generate Contract Function
  const generateContract = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a contract description');
      return;
    }

    setIsLoading(true);
    setGeneratedContract('');
    setStatus(nullStatus);
    setShowDeployment(false);

    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.contract) {
        setGeneratedContract(cleanupCodeResponse(data.contract));
        toast.success('Contract generated successfully!');
        setStatus({
          type: 'success',
          message: 'MultiversX smart contract generated successfully. You can now copy, download, or continue editing.'
        });
      } else {
        toast.error(data.error || 'Failed to generate contract');
        setStatus({
          type: 'error',
          message: data.error || 'An error occurred while generating the contract. Please try again.'
        });
      }
    } catch (error) {
      console.error('Contract generation error:', error);
      toast.error('An unexpected error occurred');
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Contract Function
  const copyContract = () => {
    if (!generatedContract) return;
    navigator.clipboard.writeText(generatedContract);
    toast.success('Contract copied to clipboard');
  };

  // Save Contract Locally
  const saveContractLocally = () => {
    if (!generatedContract) {
      toast.error('No contract to save');
      return;
    }

    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const filename = `MultiversX_Contract_${new Date().toISOString().replace(/[:.]/g, '_')}.rs`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    toast.success(`Contract saved as ${filename}`);
  };

  // Load Contract Locally
  const loadContractLocally = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          setGeneratedContract(text);
          toast.success('Contract loaded successfully');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Handle deployment completion
  const handleDeploymentComplete = (contractAddress: string, explorerUrl: string) => {
    toast.success(`Contract deployed at: ${contractAddress.substring(0, 10)}...`);
  };

  // Example contract prompts
  const contractPrompts = [
    {
        title: "Cross-Chain Token Bridge",
        prompt: "Design a cross-chain token bridge between Ethereum and MultiversX, implementing secure proof verification and optimized transfer mechanisms using Rust for MultiversX."
    },
    {
        title: "Meta Transaction Gasless Wallet",
        prompt: "Create a meta-transaction enabled wallet contract for MultiversX that allows gasless transactions, with nonce management and signature verification compatible with the EGLD protocol."
    },
    {
        title: "Dynamic Fee NFT Marketplace",
        prompt: "Develop an NFT marketplace contract that dynamically adjusts listing fees based on MultiversX's current fee structures, with built-in royalty mechanisms and role-based access control."
    },
    {
        title: "Yield Farming with EGLD Staking",
        prompt: "Implement a yield farming contract that leverages MultiversX's WASM architecture, including staking, reward distribution, and adaptive reward calculations optimized for EGLD and ESDT tokens."
    },
    {
        title: "Governance Token with Delegation",
        prompt: "Design a governance token contract for a DAO on MultiversX, implementing token delegation, voting power calculation, and proposal execution with gas-efficient mechanisms."
    },
    {
        title: "Insurance Pool with Risk Management",
        prompt: "Create a decentralized insurance pool contract on MultiversX with dynamic risk assessment, premium calculation, and claim verification using role-based access controls."
    },
    {
        title: "Multi-Signature Treasury Management",
        prompt: "Develop a multi-signature treasury management contract optimized for MultiversX, with configurable signers, transaction thresholds, and efficient execution patterns."
    },
    {
        title: "Subscription Service Contract",
        prompt: "Build an optimized subscription service contract that supports recurring payments, automatic renewals, and MultiversX-specific fee management using ESDT tokens."
    },
    {
        title: "Decentralized Identity Verification",
        prompt: "Design a decentralized identity verification contract on MultiversX that allows secure, non-transferable identity tokens with role-based access and privacy features."
    },
    {
        title: "Automated Liquidity Management",
        prompt: "Create an automated liquidity management contract for decentralized exchanges on MultiversX, implementing dynamic fee tiers and optimized rebalancing strategies."
    },
    {
        title: "Carbon Credit Trading Platform",
        prompt: "Develop a carbon credit trading platform contract on MultiversX with verifiable carbon offset tracking, transparent trading mechanisms, and role-based administrative controls."
    },
    {
        title: "Fractional Real Estate Tokenization",
        prompt: "Design a fractional real estate tokenization contract that supports secure token minting, dividend distribution, and MultiversX-optimized transfer mechanisms for ESDT tokens."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center">
                <Code2 className="h-6 w-6 mr-2 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">MultiversX Builder</h1>
                  <p className="text-xs text-blue-400">Smart Contract Builder</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/builder">
                <Button variant="outline" className="border-blue-500/30 hover:bg-blue-900/30 hover:text-blue-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Visual Builder
                </Button>
              </Link>
              <Link href="https://github.com/multiversx" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          AI Smart Contract Generator for MultiversX
        </h1>

        {/* Status Alert */}
        {status.type && (
          <div className={`
            mb-4 p-4 rounded-lg flex items-center
            ${status.type === 'error' ? 'bg-red-900/20 border border-red-500/50 text-red-200' : 
              status.type === 'success' ? 'bg-green-900/20 border border-green-500/50 text-green-200' : 
              'bg-blue-900/20 border border-blue-500/50 text-blue-200'}
          `}>
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{status.message}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Prompt Input Card */}
          <Card className="bg-gray-800/30 border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Describe Your Contract</CardTitle>
              <CardDescription className="text-gray-400">
                Provide details about the smart contract you want to build for MultiversX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter a detailed description of the smart contract you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[300px] bg-gray-900/50 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none"
              />
              <div className="mt-4 flex space-x-4">
                <Button 
                  onClick={generateContract} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isLoading ? 'Generating...' : 'Generate Contract'}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Contract Preview Card */}
          <Card className="bg-gray-800/30 border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Generated Contract</CardTitle>
              <CardDescription className="text-gray-400">
                MultiversX Rust smart contract code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContract ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-gray-800/80 border-gray-700 hover:bg-gray-700"
                      onClick={copyContract}
                      title="Copy contract"
                    >
                      <Copy className="h-4 w-4 text-gray-300" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-gray-800/80 border-gray-700 hover:bg-gray-700"
                      onClick={saveContractLocally}
                      title="Download contract"
                    >
                      <Download className="h-4 w-4 text-gray-300" />
                    </Button>
                  </div>
                  <div className="h-[300px] overflow-auto rounded-md border border-gray-700 custom-scrollbar">
                    <SyntaxHighlighter 
                      language="rust" 
                      style={materialOceanic}
                      customStyle={{ 
                        background: '#1a1d29', 
                        margin: 0,
                        padding: '1.5rem',
                        minHeight: '100%',
                        fontSize: '0.9rem',
                        lineHeight: '1.6'
                      }}
                      showLineNumbers={true}
                      wrapLongLines={true}
                    >
                      {generatedContract}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] border border-gray-700 rounded-md bg-gray-900/30">
                  <Code2 className="h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-500 text-center">
                    Your AI-generated MultiversX contract will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={saveContractLocally}
            variant="outline"
            disabled={!generatedContract}
            className="border-blue-500/30 hover:bg-blue-900/30 text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Save Contract
          </Button>
          
          <input 
            type="file" 
            id="contract-upload" 
            className="hidden" 
            accept=".rs"
            onChange={loadContractLocally}
          />
          <Button 
            onClick={() => document.getElementById('contract-upload')?.click()}
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-900/30 text-white"
          >
            <Upload className="mr-2 h-4 w-4" /> Load Contract
          </Button>
          
          {generatedContract && (
            <Button 
              onClick={() => setShowDeployment(!showDeployment)}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {showDeployment ? 'Hide Deployment' : 'Deploy Contract'}
            </Button>
          )}
        </div>
        
        {/* Deployment Panel (shown conditionally) */}
        {showDeployment && generatedContract && (
          <div className="mt-8">
            <DeploymentPanel 
              contractCode={generatedContract} 
              onDeploymentComplete={handleDeploymentComplete}
            />
          </div>
        )}

        {/* Example Prompts Section */}
        <div className="mt-12 bg-blue-900/10 p-6 rounded-lg border border-blue-500/20">
          <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            MultiversX Contract Templates
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Click on any template below to use it as a starting point for your contract
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractPrompts.map((example, index) => (
              <Card key={index} 
                className="bg-gray-800/30 border border-blue-500/20 hover:bg-blue-900/20 hover:border-blue-400/30 transition-colors cursor-pointer"
                onClick={() => setPrompt(example.prompt)}
              >
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white">
                    {example.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-900/10 p-6 rounded-lg border border-blue-500/20 mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Tips for Best Results
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Be Specific</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Describe all contract requirements in detail</li>
                <li>Specify token standards (ESDT, Meta-ESDT, NFT)</li>
                <li>Mention access control and permission requirements</li>
                <li>Include error handling expectations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">MultiversX Optimizations</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Request MultiversX-specific types and patterns</li>
                <li>Specify WASM optimization requirements</li>
                <li>Mention gas efficiency considerations</li>
                <li>Request MultiversX storage patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}