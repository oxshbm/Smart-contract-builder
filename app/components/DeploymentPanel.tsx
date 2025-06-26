// app/components/DeploymentPanel.tsx
import React, { useState } from 'react';
import { Shield, Zap, ChevronRight, AlertCircle, Check, Loader2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { deployContract } from '@/app/services/deployment.service';

// Define deployment step types
type DeploymentStep = {
  id: string;
  title: string;
  description: string;
};

// Define deployment status
type DeploymentStatus = 'idle' | 'processing' | 'success' | 'error';

// Define step status
type StepStatus = 'pending' | 'current' | 'completed' | 'error';

// Define props for component
interface DeploymentPanelProps {
  contractCode: string;
  onDeploymentComplete?: (contractAddress: string, explorerUrl: string) => void;
}

// Define the steps in the deployment process
const deploymentSteps: DeploymentStep[] = [
  {
    id: 'connect',
    title: 'Connect Wallet',
    description: 'Connect to MultiversX Web Wallet or xPortal App'
  },
  {
    id: 'compile',
    title: 'Compile Contract',
    description: 'Optimize and compile Rust code to WASM'
  },
  {
    id: 'deploy',
    title: 'Deploy Contract',
    description: 'Send transaction to the MultiversX network'
  },
  {
    id: 'verify',
    title: 'Verify Contract',
    description: 'Verify contract source code on the network'
  }
];

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ 
  contractCode,
  onDeploymentComplete
}) => {
  const [overallStatus, setOverallStatus] = useState<DeploymentStatus>('idle');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    deploymentSteps.reduce((acc, step) => ({
      ...acc,
      [step.id]: 'pending'
    }), {})
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [deployedContract, setDeployedContract] = useState<{
    address: string;
    explorerUrl: string;
  } | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<'devnet' | 'testnet' | 'mainnet'>('testnet');

  // Reset deployment state
  const resetDeployment = () => {
    setOverallStatus('idle');
    setCurrentStep('');
    setStepStatuses(
      deploymentSteps.reduce((acc, step) => ({
        ...acc,
        [step.id]: 'pending'
      }), {})
    );
    setErrorMessage('');
    setDeployedContract(null);
  };

  // Update a step's status
  const updateStepStatus = (stepId: string, status: StepStatus) => {
    setStepStatuses(prev => ({
      ...prev,
      [stepId]: status
    }));
  };

  // Perform the deployment process
  const handleDeploy = async (networkType: 'devnet' | 'testnet' | 'mainnet') => {
    // Reset state for new deployment
    resetDeployment();
    setSelectedNetwork(networkType);
    setOverallStatus('processing');
    
    try {
      // Update wallet connection step
      setCurrentStep('connect');
      updateStepStatus('connect', 'current');
      
      // Start actual deployment process using the service
      const result = await deployContract(contractCode, networkType);
      
      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }
      
      // Update wallet connection step as completed
      updateStepStatus('connect', 'completed');
      
      // Update compilation step
      setCurrentStep('compile');
      updateStepStatus('compile', 'current');
      // In a real implementation, this would be tracked within the deployment service
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStepStatus('compile', 'completed');
      
      // Update deployment step
      setCurrentStep('deploy');
      updateStepStatus('deploy', 'current');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (result.address && result.explorerUrl) {
        setDeployedContract({
          address: result.address,
          explorerUrl: result.explorerUrl
        });
      }
      
      updateStepStatus('deploy', 'completed');
      
      // Update verification step
      setCurrentStep('verify');
      updateStepStatus('verify', 'current');
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStepStatus('verify', 'completed');
      
      // Complete deployment
      setOverallStatus('success');
      setCurrentStep('');
      
      // Call completion callback if provided
      if (onDeploymentComplete && result.address && result.explorerUrl) {
        onDeploymentComplete(result.address, result.explorerUrl);
      }
    } catch (error: any) {
      console.error('Deployment error:', error);
      setErrorMessage(error.message || 'An unknown error occurred');
      setOverallStatus('error');
      
      // Mark current step as failed
      if (currentStep) {
        updateStepStatus(currentStep, 'error');
      }
    }
  };
  
  // Render the step indicator
  const renderStep = (step: DeploymentStep, index: number) => {
    const status = stepStatuses[step.id];
    
    return (
      <div key={step.id} className="flex items-start mb-4 last:mb-0">
        <div className="flex-shrink-0 mr-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status === 'completed' ? 'bg-green-600' :
            status === 'current' ? 'bg-blue-600 animate-pulse' :
            status === 'error' ? 'bg-red-600' :
            'bg-gray-700'
          }`}>
            {status === 'completed' ? (
              <Check className="h-5 w-5 text-white" />
            ) : status === 'current' ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : status === 'error' ? (
              <AlertCircle className="h-5 w-5 text-white" />
            ) : (
              <span className="text-white text-sm font-medium">{index + 1}</span>
            )}
          </div>
        </div>
        <div className="flex-grow pt-1">
          <h3 className={`text-base font-medium ${
            status === 'completed' ? 'text-green-400' :
            status === 'current' ? 'text-blue-400' :
            status === 'error' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {step.title}
          </h3>
          <p className="text-sm text-gray-500">{step.description}</p>
        </div>
      </div>
    );
  };
  
  // Get network name based on selected type
  const getNetworkName = () => {
    switch (selectedNetwork) {
      case 'devnet': return 'Devnet';
      case 'testnet': return 'Testnet';
      case 'mainnet': return 'Mainnet';
      default: return 'Testnet';
    }
  };
  
  return (
    <Card className="bg-gray-800/30 border border-blue-500/20 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {overallStatus === 'idle' ? 'Deploy Contract' : 
           overallStatus === 'processing' ? 'Deploying Contract...' :
           overallStatus === 'success' ? 'Contract Deployed!' :
           'Deployment Failed'}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {overallStatus === 'idle' ? 'Deploy your MultiversX contract to testnet or mainnet' :
           overallStatus === 'processing' ? `Deploying to ${getNetworkName()}...` :
           overallStatus === 'success' ? `Successfully deployed to ${getNetworkName()}` :
           'There was an error during deployment'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {overallStatus === 'error' && (
          <Alert className="mb-4 border-red-500/50 bg-red-900/20 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Deployment Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {overallStatus === 'success' && deployedContract && (
          <Alert className="mb-4 border-green-500/50 bg-green-900/20 text-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Deployment Successful</AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <p>Contract Address: {deployedContract.address.slice(0, 10)}...{deployedContract.address.slice(-6)}</p>
              <a 
                href={deployedContract.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 hover:underline"
              >
                View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {deploymentSteps.map((step, index) => renderStep(step, index))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-gray-700 pt-4">
        {overallStatus === 'idle' ? (
          <>
            <Button 
              className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 w-full sm:w-auto"
              onClick={() => handleDeploy('testnet')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Deploy to Testnet
            </Button>
            <Button 
              className="bg-transparent hover:bg-blue-900/30 text-white border border-blue-500/30 w-full sm:w-auto"
              onClick={() => handleDeploy('mainnet')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Deploy to Mainnet
            </Button>
          </>
        ) : overallStatus === 'processing' ? (
          <Button disabled className="w-full sm:w-auto">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deploying...
          </Button>
        ) : (
          <Button 
            onClick={resetDeployment}
            variant="outline" 
            className="border-blue-500/30 hover:bg-blue-900/30 text-white w-full sm:w-auto"
          >
            Start New Deployment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeploymentPanel;