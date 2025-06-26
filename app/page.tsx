'use client';

import { Code2, Shield, Zap, Coins, Brain, Layers, Menu, ChevronDown, Rocket, Globe, Users, BookOpen, Sparkles } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';

// Custom button component
const Button = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Stat card component
const StatCard = ({ value, label, icon: Icon }) => (
  <div className="px-6 py-6 sm:p-8 rounded-2xl bg-gray-800/30 border border-blue-500/20 backdrop-blur-sm hover:scale-105 transition-all duration-300">
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
        <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {value}
        </span>
      </div>
      <p className="text-sm sm:text-base text-gray-300 font-medium">{label}</p>
    </div>
  </div>
);

// Dropdown Menu Component
const NavDropdown = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-300 hover:text-white transition-colors font-medium text-sm"
      >
        {Icon && <Icon className="h-4 w-4 mr-2 text-blue-400" />}
        {title}
        <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-blue-500/20 rounded-lg shadow-2xl p-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
const DropdownItem = ({ href, icon: Icon, title, description }) => (
  <Link 
    href={href} 
    className="block p-3 rounded-md hover:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center">
      {Icon && <Icon className="h-6 w-6 mr-3 text-blue-400 group-hover:text-blue-300" />}
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  </Link>
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="bg-gray-950 border-b border-blue-500/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo Section */}
              <div className="flex items-center">
                <div className="flex items-center">
                  <Code2 className="h-8 w-8 mr-3 text-blue-500" />
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      MultiverseX
                    </h1>
                    <p className="text-xs font-medium text-blue-300 tracking-wider uppercase -mt-0.5">
                      Contract Builder
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Solutions Dropdown */}
                <NavDropdown title="Solutions" icon={Rocket}>
                  <DropdownItem 
                    href="/builder" 
                    icon={Code2}
                    title="Visual Contract Builder"
                    description="Create smart contracts without coding"
                  />
                  <DropdownItem 
                    href="/ai-contract-generator" 
                    icon={Sparkles}
                    title="AI Contract Generator"
                    description="AI-powered smart contract creation"
                  />
                </NavDropdown>

                {/* Resources Dropdown */}
                <NavDropdown title="Resources" icon={BookOpen}>
                  <DropdownItem 
                    href="/docs" 
                    icon={Globe}
                    title="Documentation"
                    description="Comprehensive guides and references"
                  />
                  <DropdownItem 
                    href="/community" 
                    icon={Users}
                    title="Community"
                    description="Connect with other developers"
                  />
                </NavDropdown>

                {/* Direct Links */}
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                  Pricing
                </Link>

                {/* Launch App Button */}
                <Link href="/launch" className="ml-4">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                    <Rocket className="h-4 w-4 mr-2" />
                    Launch App
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white focus:outline-none"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gray-950 backdrop-blur-md">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {/* Mobile Dropdowns */}
              <div className="border-b border-gray-800 pb-2 mb-2">
                <button className="w-full text-left flex justify-between items-center text-white py-2">
                  <span>Solutions</span>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="pl-4 space-y-2 mt-2">
                  <Link 
                    href="/builder" 
                    className="block text-gray-300 hover:text-white py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Visual Contract Builder
                  </Link>
                  <Link 
                    href="/ai-contract-generator" 
                    className="block text-gray-300 hover:text-white py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Contract Generator
                  </Link>
                </div>
              </div>

              <div className="border-b border-gray-800 pb-2 mb-2">
                <button className="w-full text-left flex justify-between items-center text-white py-2">
                  <span>Resources</span>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="pl-4 space-y-2 mt-2">
                  <Link 
                    href="/docs" 
                    className="block text-gray-300 hover:text-white py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link 
                    href="/community" 
                    className="block text-gray-300 hover:text-white py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community
                  </Link>
                </div>
              </div>

              <Link 
                href="/pricing"
                className="block text-white py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              <Link 
                href="/launch"
                className="block mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-blue-500/10 border border-blue-500/20">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Next-Gen Smart Contract Development
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            Build <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">MultiverseX</span> Smart Contracts Visually
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-10 mx-auto max-w-3xl">
            Create, customize, and deploy secure smart contracts on MultiversX without writing code. Our visual builder and AI assistant make blockchain development accessible to everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/builder">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 border border-blue-500/30 text-xl">
                Visual Builder
                <Code2 className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            
            <Link href="/ai-contract-generator">
              <Button className="bg-transparent hover:bg-blue-900/30 text-white px-8 py-4 rounded-lg border border-blue-500/30 text-xl">
                AI Builder
                <Brain className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-4xl mx-auto">
            <StatCard value="15+" label="Contract Templates" icon={Shield} />
            <StatCard value="100x" label="WASM Performance" icon={Zap} />
            <StatCard value="2M+" label="Transactions/Day" icon={Coins} />
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-16 sm:py-24 border-t border-blue-500/10 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                MultiversX Ecosystem
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A complete environment for building next-generation dApps with unparalleled performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Layers,
                title: "Adaptive State Sharding",
                description: "Parallel processing for unlimited scalability"
              },
              {
                icon: Shield,
                title: "Secure Proof of Stake",
                description: "Energy-efficient consensus mechanism"
              },
              {
                icon: Zap,
                title: "WASM Virtual Machine",
                description: "Fast, efficient smart contract execution"
              },
              {
                icon: Coins,
                title: "Cross-Chain Interoperability",
                description: "Seamless integration with other blockchains"
              }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-800/30 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 mb-4">
                    <item.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/20"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers creating the future on MultiversX's high-performance blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-lg rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  Launch Builder
                  <Code2 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button className="bg-transparent hover:bg-blue-900/30 text-white px-6 py-3 text-lg rounded-lg border border-blue-500/30">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}