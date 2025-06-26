'use client';

// File: app/components/background-effects.tsx

import React, { useState, useEffect } from 'react';

// Customizable grid component with responsive sizing and animation options
const GridLines = ({ 
  gridColor = '#1a365d10', 
  dotColor = '#1a365d10',
  gridSize = 40,
  dotSize = 20,
  animate = true 
}) => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setOffset(prev => (prev + 0.5) % gridSize);
    }, 50);
    
    return () => clearInterval(interval);
  }, [animate, gridSize]);
  
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0 transition-transform duration-1000"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          transform: animate ? `translateX(${offset}px) translateY(${offset}px)` : 'none'
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
          backgroundSize: `${dotSize}px ${dotSize}px`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
    </div>
  );
};

// Enhanced glow effects with customizable colors and positions
const Glow = ({ 
  primaryColor = 'rgb(37, 99, 235)', 
  secondaryColor = 'rgb(59, 130, 246)',
  tertiaryColor = 'rgb(96, 165, 250)', 
  pulseSpeed = 3
}) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className={`absolute -top-40 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow`}
        style={{ 
          backgroundColor: primaryColor,
          animation: `pulse ${pulseSpeed}s ease-in-out infinite`
        }}
      />
      <div 
        className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl`}
        style={{ 
          backgroundColor: secondaryColor,
          animation: `pulse ${pulseSpeed + 1}s ease-in-out infinite reverse` 
        }}
      />
      <div 
        className={`absolute top-1/3 -right-40 w-72 h-72 rounded-full opacity-10 blur-3xl`}
        style={{ 
          backgroundColor: tertiaryColor,
          animation: `pulse ${pulseSpeed + 2}s ease-in-out infinite 1s` 
        }}
      />
    </div>
  );
};

// Subtle floating particles that move slowly
const Particles = ({ count = 20, color = 'rgba(59, 130, 246, 0.3)' }) => {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 30 + 30}s`,
    animationDelay: `${Math.random() * 10}s`,
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: particle.left,
            top: particle.top,
            backgroundColor: color,
            opacity: Math.random() * 0.5 + 0.2,
            animationDuration: particle.animationDuration,
            animationDelay: particle.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

// Noise texture overlay for added richness
const NoiseTexture = ({ opacity = 0.03 }) => (
  <div 
    className="absolute inset-0 z-1 pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      opacity: opacity
    }}
  />
);

export function BackgroundEffects({
  // Main configuration options
  enableGrid = true,
  enableGlow = true,
  enableParticles = true,
  enableNoise = true,
  
  // Component-specific options
  gridOptions = {},
  glowOptions = {},
  particleOptions = {},
  noiseOptions = {},
  
  // Global options
  className = "",
  style = {}
}) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`} style={style}>
      {enableGrid && <GridLines {...gridOptions} />}
      {enableGlow && <Glow {...glowOptions} />}
      {enableParticles && <Particles {...particleOptions} />}
      {enableNoise && <NoiseTexture {...noiseOptions} />}
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, 10px); }
          50% { transform: translate(-5px, 20px); }
          75% { transform: translate(-15px, 5px); }
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}