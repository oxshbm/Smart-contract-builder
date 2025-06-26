import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertCircle, Code2, Package, X, Zap, Shield, Brain, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { deployContract } from '@/app/services/deployment.service';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import ComponentCard from './EnhancedComponentCard';

interface DragItem {
  id: string;
  index: number;
}

interface DraggableComponentProps {
  id: string;
  children: React.ReactNode;
  index: number;
  moveComponent?: (dragIndex: number, hoverIndex: number) => void;
}

interface ContractComponent {
  id: string;
  name: string;
  description: string;
  template: string;
}

interface DeploymentStatus {
  type: 'error' | 'success' | 'info';
  message: string | React.ReactNode;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: any[];
      }) => Promise<any>;
      isMetaMask?: boolean;
    }
  }
}

// Contract templates with MultiversX-specific features
const CONTRACT_TEMPLATES = {
  'meta-tx': `// Meta Transaction Handler for MultiversX
#[multiversx_sc::contract]
pub trait MetaTransactionModule {
    #[view(getNonce)]
    #[storage_mapper("nonce")]
    fn nonce(&self, user: &ManagedAddress) -> SingleValueMapper<u64>;
    
    #[endpoint(executeMetaTx)]
    fn execute_meta_tx(
        &self,
        user: ManagedAddress,
        function_call: ManagedBuffer,
        nonce: u64,
        percentage: u64,
        signature: ManagedBuffer,
    ) {
        // Verify nonce
        let user_nonce = self.nonce(&user).get();
        require!(nonce == user_nonce, "Invalid nonce");
        self.nonce(&user).set(user_nonce + 1);
        
        // Verify signature and execute transaction
        // Handle gas fee delegation based on percentage
    }
}`,
  'erc20': `// ESDT Token Implementation for MultiversX
#[multiversx_sc::contract]
pub trait EsdtToken {
    #[init]
    fn init(&self) {
        // Initialize token properties
    }
    
    // Issue a new ESDT token
    #[only_owner]
    #[payable("EGLD")]
    #[endpoint(issueToken)]
    fn issue_token(
        &self,
        token_name: ManagedBuffer,
        token_ticker: ManagedBuffer,
        initial_supply: BigUint,
        num_decimals: usize,
        #[payment] issue_cost: BigUint
    ) {
        // Token issuance logic
    }
    
    // Transfer tokens to a specific address
    #[endpoint(transfer)]
    fn transfer(
        &self,
        to: ManagedAddress, 
        amount: BigUint
    ) {
        // Transfer logic with MultiversX-specific optimizations
    }
}`,
  'access': `// Role-based access control for MultiversX
#[multiversx_sc::contract]
pub trait AccessControl {
    #[view(hasRole)]
    fn has_role(&self, role: &ManagedBuffer, address: &ManagedAddress) -> bool {
        self.roles(role).contains(address)
    }
    
    #[storage_mapper("roles")]
    fn roles(&self, role: &ManagedBuffer) -> UnorderedSetMapper<ManagedAddress>;
    
    #[only_owner]
    #[endpoint(grantRole)]
    fn grant_role(&self, role: ManagedBuffer, address: ManagedAddress) {
        self.roles(&role).insert(address);
    }
    
    #[only_owner]
    #[endpoint(revokeRole)]
    fn revoke_role(&self, role: ManagedBuffer, address: ManagedAddress) {
        self.roles(&role).remove(&address);
    }
}`,
  'bridge-adapter': `// MultiversX Bridge Adapter
#[multiversx_sc::contract]
pub trait BridgeAdapter {
    #[init]
    fn init(
        &self,
        eth_bridge_address: ManagedAddress,
        mx_bridge_address: ManagedAddress
    ) {
        self.eth_bridge_address().set(eth_bridge_address);
        self.mx_bridge_address().set(mx_bridge_address);
    }
    
    #[storage_mapper("ethBridgeAddress")]
    fn eth_bridge_address(&self) -> SingleValueMapper<ManagedAddress>;
    
    #[storage_mapper("mxBridgeAddress")]
    fn mx_bridge_address(&self) -> SingleValueMapper<ManagedAddress>;
    
    #[payable("ESDT")]
    #[endpoint(bridgeToEthereum)]
    fn bridge_to_ethereum(
        &self,
        eth_address: ManagedBuffer,
        #[payment_token] token_id: TokenIdentifier,
        #[payment_amount] amount: BigUint
    ) {
        // Bridge implementation logic
    }
}`,
  'gas-optimizer': `// MultiversX Gas Optimizer
#[multiversx_sc::contract]
pub trait GasOptimizer {
    // Cache commonly used values
    #[storage_mapper("cachedValues")]
    fn cached_values(&self, key: &ManagedBuffer) -> SingleValueMapper<ManagedBuffer>;
    
    // Batch operations for gas efficiency
    #[endpoint(batchTransfer)]
    fn batch_transfer(
        &self,
        token_id: TokenIdentifier,
        recipients: MultiValueEncoded<ManagedAddress>,
        amounts: MultiValueEncoded<BigUint>
    ) {
        // Efficient batch token transfer implementation
    }
    
    // Get optimal gas limit for operations
    #[view(getOptimalGasLimit)]
    fn get_optimal_gas_limit(&self, operation_type: ManagedBuffer) -> u64 {
        // Calculate optimal gas based on operation type
        // Default example value
        64_000_000
    }
}`,
  'token-ratio': `// MultiversX Token Ratio Handler
#[multiversx_sc::contract]
pub trait TokenRatioModule {
    // Store the token ratio mapping
    #[storage_mapper("tokenRatios")]
    fn token_ratios(&self, token_id: &TokenIdentifier) -> SingleValueMapper<BigUint>;
    
    // Set token to EGLD ratio
    #[only_owner]
    #[endpoint(setTokenRatio)]
    fn set_token_ratio(
        &self,
        token_id: TokenIdentifier,
        ratio: BigUint
    ) {
        self.token_ratios(&token_id).set(ratio);
    }
    
    // Get token to EGLD ratio
    #[view(getTokenRatio)]
    fn get_token_ratio(&self, token_id: TokenIdentifier) -> BigUint {
        self.token_ratios(&token_id).get()
    }
}`,
  'nft': `// NFT implementation with MultiversX optimizations
#[multiversx_sc::contract]
pub trait NftModule {
    #[init]
    fn init(&self) {
        // Initialize NFT collection properties
    }
    
    #[only_owner]
    #[payable("EGLD")]
    #[endpoint(issueNftCollection)]
    fn issue_nft_collection(
        &self,
        collection_name: ManagedBuffer,
        collection_ticker: ManagedBuffer,
        #[payment] issue_cost: BigUint
    ) {
        // NFT Collection issuance logic
    }
    
    #[only_owner]
    #[endpoint(createNft)]
    fn create_nft(
        &self,
        name: ManagedBuffer,
        royalties: BigUint,
        uri: ManagedBuffer,
        attributes: ManagedBuffer
    ) -> u64 {
        // NFT creation logic with gas optimizations
        // Returns the NFT nonce
        1u64 // Placeholder return
    }
    
    #[only_owner]
    #[endpoint(transferNft)]
    fn transfer_nft(
        &self,
        to: ManagedAddress,
        token_id: TokenIdentifier,
        nonce: u64,
        amount: BigUint
    ) {
        // NFT transfer logic
    }
}`
};

const ContractComponents = [
  {
    id: 'meta-tx',
    name: 'Meta Transaction',
    description: 'Enable gasless transactions with MultiversX support',
    template: CONTRACT_TEMPLATES['meta-tx']
  },
  {
    id: 'erc20',
    name: 'ESDT Token',
    description: 'Standard ESDT with MultiversX optimizations',
    template: CONTRACT_TEMPLATES['erc20']
  },
  {
    id: 'access',
    name: 'Access Control',
    description: 'Role-based access management',
    template: CONTRACT_TEMPLATES['access']
  },
  {
    id: 'bridge-adapter',
    name: 'Bridge Adapter',
    description: 'Cross-chain bridge integration for token transfers',
    template: CONTRACT_TEMPLATES['bridge-adapter']
  },
  {
    id: 'gas-optimizer',
    name: 'Gas Optimizer',
    description: 'MultiversX-specific gas optimization utilities',
    template: CONTRACT_TEMPLATES['gas-optimizer']
  },
  {
    id: 'token-ratio',
    name: 'Token Ratio Handler',
    description: 'Manages MultiversX token ratios for fees',
    template: CONTRACT_TEMPLATES['token-ratio']
  },
  {
    id: 'nft',
    name: 'NFT Contract',
    description: 'NFT implementation with MultiversX optimizations',
    template: CONTRACT_TEMPLATES['nft']
  }
];

const DraggableComponent: React.FC<DraggableComponentProps> = ({ 
  id, 
  children, 
  index, 
  moveComponent 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { id, index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'component',
    hover: (item: DragItem) => {
      if (!moveComponent) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Combine the drag and drop refs using useMemo
  const dragDropRef = React.useMemo(
    () => {
      return (node: HTMLDivElement | null) => {
        drag(node);
        drop(node);
      };
    },
    [drag, drop]
  );

  return (
    <div 
      ref={dragDropRef}
      className={`transition-opacity duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {children}
    </div>
  );
};

export default function Builder() {
  const [selectedComponents, setSelectedComponents] = useState<ContractComponent[]>([]);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setSelectedComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      const dragComponent = newComponents[dragIndex];
      newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, dragComponent);
      return newComponents;
    });
  }, []);

  // Function to handle deployment
  const handleDeploy = async (isTestnet: boolean) => {
    try {
      // Check if components are selected
      if (selectedComponents.length === 0) {
        setDeploymentStatus({
          type: 'error',
          message: 'Please add at least one component to deploy'
        });
        return;
      }

      setIsDeploying(true);
      setDeploymentStatus({
        type: 'info',
        message: 'Preparing contract for deployment...'
      });

      // Generate contract code
      const contractCode = generateCode();
      const networkType = isTestnet ? 'testnet' : 'mainnet';
      
      // Deploy using the deployment service
      setDeploymentStatus({
        type: 'info',
        message: `Deploying to ${isTestnet ? 'Testnet' : 'Mainnet'}...`
      });

      const result = await deployContract(contractCode, networkType);

      if (result.success && result.address && result.explorerUrl) {
        setDeploymentStatus({
          type: 'success',
          message: (
            <div className="flex flex-col space-y-2">
              <span>Contract deployed successfully!</span>
              <a 
                href={result.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View on Explorer: {result.address.substring(0, 10)}...{result.address.substring(result.address.length - 6)}
              </a>
            </div>
          )
        });
      } else {
        throw new Error(result.error || 'Deployment failed');
      }

    } catch (error: any) {
      let errorMessage = error.message || 'Unknown error';
      
      setDeploymentStatus({
        type: 'error',
        message: `Deployment failed: ${errorMessage}`
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Generate Rust code
  const generateCode = useCallback(() => {
    // Clean components
    const cleanedComponents = selectedComponents.map(component => 
      component.template
        .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multiline comments
        .replace(/\/\/.*/g, '')            // Remove single-line comments
        .replace(/\n\s*\n/g, '\n')         // Remove extra blank lines
        .trim()
    );
  
    if (cleanedComponents.length === 0) {
      return `// No components selected
// Add components from the left panel to generate code

#[multiversx_sc::contract]
pub trait EmptyContract {
    #[init]
    fn init(&self) {
        // Initialize contract
    }
}`;
    }
    
    // Generate trait list for contract composition
    const traitList = selectedComponents.map(comp => {
      const traitNameMatch = comp.template.match(/pub trait ([a-zA-Z0-9_]+)/);
      return traitNameMatch ? traitNameMatch[1] : '';
    }).filter(name => name).join(' + ');
    
    return `// MultiversX Smart Contract
// Generated with MultiversX Builder

#[multiversx_sc::contract]
pub trait MultiversXGeneratedContract: ${traitList || 'Clone'}
{
    #[init]
    fn init(&self) {
        // Initialize contract state
    }
    
    // View function to get contract info
    #[view(getContractInfo)]
    fn get_contract_info(&self) -> ManagedBuffer {
        ManagedBuffer::from(b"MultiversX Contract built with MultiversX builder")
    }
}

// Dynamically Composed Contract Components
${cleanedComponents.join('\n\n')}`;
  }, [selectedComponents]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Enhanced Header */}
        <div className="border-b border-blue-500/20 bg-gray-900/90 backdrop-blur-sm">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Code2 className="h-6 w-6 mr-2 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">MultiversX Builder</h1>
                  <p className="text-xs text-blue-400">Smart Contract Builder</p>
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Button 
                variant="outline"
                className="border-2 border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/30 text-white transition-colors"
                onClick={() => handleDeploy(true)}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></span>
                    Deploying...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy to Testnet
                  </>
                )}
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-500 transition-colors text-white border border-blue-500/30 shadow-lg shadow-blue-600/20"
                onClick={() => handleDeploy(false)}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Deploying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Deploy to Mainnet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page Subtitle */}
        <div className="container mx-auto mt-6 px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-blue-500/10 border border-blue-500/20">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Visual Contract Builder
            </span>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Drag and drop components to create custom smart contracts for the MultiversX blockchain
          </p>
        </div>

        {/* Deployment Status Alert */}
        {deploymentStatus && (
          <Alert className={`mx-6 mt-4 border-2 ${
            deploymentStatus.type === 'error' ? 'border-red-500/50 bg-red-900/20' : 
            deploymentStatus.type === 'success' ? 'border-green-500/50 bg-green-900/20' : 
            'border-blue-500/50 bg-blue-900/20'
          }`}>
            <AlertCircle className={`h-5 w-5 ${
              deploymentStatus.type === 'error' ? 'text-red-400' : 
              deploymentStatus.type === 'success' ? 'text-green-400' : 
              'text-blue-400'
            }`} />
            <AlertTitle className="font-semibold text-white">Deployment Status</AlertTitle>
            <AlertDescription className="text-gray-300">
              {deploymentStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-12rem)]">
          {/* Component Library Panel */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Package className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Components</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-18rem)]">
                <div className="grid gap-4 pr-4">
                  {ContractComponents.map((component) => (
                    <div key={component.id} className="transition-transform hover:scale-[1.02]">
                      <Card className="bg-blue-900/10 border border-blue-500/20 hover:border-blue-400/50 transition-colors cursor-pointer" onClick={() => setSelectedComponents([...selectedComponents, component])}>
                        <CardHeader className="py-4">
                          <CardTitle className="text-base text-white">{component.name}</CardTitle>
                          <CardDescription className="text-gray-300">{component.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-blue-500/20 hover:bg-blue-400/30" />

          {/* Builder Panel */}
          <ResizablePanel defaultSize={35} minSize={25}>
            <div className="h-full p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Brain className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Contract Builder</h2>
              </div>
              <div className={`min-h-[calc(100vh-20rem)] rounded-xl border-2 border-dashed 
                ${selectedComponents.length === 0 ? 'border-blue-500/30 bg-blue-900/10' : 'border-blue-400/40 bg-blue-900/20'} 
                transition-colors p-4`}>
                <ScrollArea className="h-full">
                  {selectedComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                      <Package className="h-12 w-12 mb-4 text-blue-500/60" />
                      <p className="text-center">
                        Click components from the left panel<br />to start building your contract
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedComponents.map((component, index) => (
                        <DraggableComponent
                          key={`${component.id}-${index}`}
                          id={component.id}
                          index={index}
                          moveComponent={moveComponent}
                        >
                          <Card className="cursor-move border-2 border-blue-500/20 bg-blue-900/20 hover:border-blue-400/50 transition-colors">
                            <CardHeader className="py-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base text-white">{component.name}</CardTitle>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-red-900/30 hover:text-red-400 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription className="text-gray-300">{component.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </DraggableComponent>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-blue-500/20 hover:bg-blue-400/30" />

          {/* Code Preview Panel */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Generated Code</h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/30 hover:bg-blue-900/30 text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(generateCode());
                    toast.success('Code copied to clipboard');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              
              <Card className="h-[calc(100vh-22rem)] border-2 border-blue-500/20 bg-gray-900 overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="h-full rounded-lg bg-gray-900 text-gray-100 overflow-hidden">
                    {/* Using SyntaxHighlighter with proper size settings */}
                    <div className="h-full overflow-auto custom-scrollbar">
                      <SyntaxHighlighter 
                        language="rust" 
                        style={materialOceanic}
                        customStyle={{ 
                          margin: 0,
                          padding: '1.5rem',
                          background: '#1a1d29',
                          minHeight: '100%',
                          height: 'auto',
                          overflow: 'visible',
                          fontSize: '0.9rem',
                          lineHeight: '1.6'
                        }}
                        showLineNumbers={true}
                        wrapLines={true}
                        lineNumberStyle={{
                          color: '#718096',
                          fontSize: '0.8rem',
                          marginRight: '1em',
                          borderRight: '1px solid #2D3748',
                          paddingRight: '0.5em'
                        }}
                      >
                        {generateCode()}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 px-2 text-sm text-gray-400">
                <p>This code is ready to deploy on the MultiversX blockchain using the buttons at the top of the page.</p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* CTA Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/20"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Deploy Your Contract?
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Deploy your custom smart contract to the MultiversX blockchain
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-lg rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20"
                  onClick={() => handleDeploy(false)}
                  disabled={isDeploying}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy to Mainnet'}
                  {!isDeploying && <Shield className="ml-2 h-5 w-5" />}
                </Button>
                <Button 
                  className="bg-transparent hover:bg-blue-900/30 text-white px-6 py-3 text-lg rounded-lg border border-blue-500/30"
                  onClick={() => handleDeploy(true)}
                  disabled={isDeploying}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy to Testnet'}
                  {!isDeploying && <Zap className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DndProvider>
  );
}