import React from 'react';
import { Info } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the structure of a component
interface ContractComponent {
  id: string;
  name: string;
  description: string;
  template?: string;
}

// Define the structure of the explanation object
interface ComponentExplanation {
  purpose: string;
  benefits: string[];
  useCase: string;
}

// Define the structure of all explanations
type ExplanationsType = {
  [key: string]: ComponentExplanation;
}

// Define the props interface for the component
interface ComponentCardProps {
  component: ContractComponent;
  onClick: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onClick }) => {
  // Define the explanations object with its type
  const explanations: ExplanationsType = {
    'meta-tx': {
      purpose: "Enables gasless transactions where a third party can pay for gas fees on behalf of users",
      benefits: [
        "Improves user experience by removing gas fee barrier",
        "Users can interact with dApps without holding EGLD tokens",
        "Supports partial fee delegation with percentage splits"
      ],
      useCase: "Perfect for dApps wanting to subsidize user transactions or implement gasless onboarding"
    },
    'erc20': {
      purpose: "Standard ESDT token implementation optimized for MultiversX's gas model",
      benefits: [
        "Lower transaction costs through MultiversX-specific optimizations",
        "Built-in admin controls for token management",
        "Standard ESDT compatibility for exchange listings"
      ],
      useCase: "Ideal for creating new tokens, governance tokens, or reward systems"
    },
    'access': {
      purpose: "Role-based permission system for contract access control",
      benefits: [
        "Granular control over contract functions",
        "Multiple admin roles with different permissions",
        "Easy to add/revoke permissions"
      ],
      useCase: "Essential for contracts requiring different permission levels"
    },
    'bridge-adapter': {
      purpose: "Facilitates token transfers between Ethereum and MultiversX",
      benefits: [
        "Native integration with MultiversX's official bridge",
        "Secure cross-chain token transfers",
        "Automatic state verification"
      ],
      useCase: "Required for dApps operating across both Ethereum and MultiversX networks"
    },
    'gas-optimizer': {
      purpose: "Utilities for optimizing gas usage on MultiversX",
      benefits: [
        "Automatically adjusts gas prices based on network conditions",
        "Implements MultiversX's recommended gas patterns",
        "Reduces transaction costs"
      ],
      useCase: "Helpful for contracts with complex operations needing gas optimization"
    },
    'token-ratio': {
      purpose: "Manages MultiversX's token mechanisms for fee calculations",
      benefits: [
        "Handles EGLD to ESDT price ratios for fees",
        "Automatic fee adjustments based on market conditions",
        "Ensures stable transaction costs"
      ],
      useCase: "Important for contracts involving fee calculations or token swaps"
    },
    'nft': {
      purpose: "NFT implementation with MultiversX-specific optimizations",
      benefits: [
        "Gas-efficient NFT operations",
        "Standard NFT compatibility",
        "Optimized metadata handling"
      ],
      useCase: "Perfect for NFT collections, gaming assets, or digital collectibles"
    }
  };

  // Add type safety check for the explanation lookup
  const componentExplanation = explanations[component.id];
  if (!componentExplanation) {
    return null; // Or handle the error case appropriately
  }

  return (
    <TooltipProvider>
      <Card 
        className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
        onClick={onClick}
      >
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-semibold">{component.name}</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors"/>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Purpose:</p>
                  <p className="text-sm text-gray-200">{componentExplanation.purpose}</p>
                  
                  <p className="font-semibold text-sm mt-2">Benefits:</p>
                  <ul className="text-sm list-disc pl-4 text-gray-200">
                    {componentExplanation.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                  
                  <p className="font-semibold text-sm mt-2">Best for:</p>
                  <p className="text-sm text-gray-200">{componentExplanation.useCase}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className="text-xs mt-1">
            {component.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </TooltipProvider>
  );
};

export default ComponentCard;