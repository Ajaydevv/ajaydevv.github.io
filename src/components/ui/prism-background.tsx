import React from 'react';

interface PrismBackgroundProps {
  className?: string;
}

export const PrismBackground: React.FC<PrismBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Base gradient background with more visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-blog-primary/5 to-blog-accent/5" />
      
      {/* Animated prism shapes with enhanced visibility */}
      <div className="absolute inset-0">
        {/* Large floating prism 1 - More visible */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-50">
          <div 
            className="w-full h-full bg-gradient-to-br from-blog-primary/30 via-blog-accent/40 to-transparent 
                       transform rotate-12 animate-float-slow shadow-lg"
            style={{
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
              animationDelay: '0s',
              filter: 'blur(1px)'
            }}
          />
        </div>

        {/* Large floating prism 2 - Enhanced */}
        <div className="absolute top-3/4 right-1/4 w-48 h-48 opacity-45">
          <div 
            className="w-full h-full bg-gradient-to-tr from-blog-accent/35 via-blog-primary/30 to-transparent 
                       transform -rotate-12 animate-float-medium shadow-lg"
            style={{
              clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
              animationDelay: '2s',
              filter: 'blur(1px)'
            }}
          />
        </div>

        {/* Medium floating prism 3 - More prominent */}
        <div className="absolute top-1/2 right-1/3 w-32 h-32 opacity-40">
          <div 
            className="w-full h-full bg-gradient-to-bl from-blog-primary/25 via-blog-accent/35 to-transparent 
                       transform rotate-45 animate-float-fast shadow-md"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              animationDelay: '4s'
            }}
          />
        </div>

        {/* Small floating prism 4 - Enhanced visibility */}
        <div className="absolute top-1/6 right-1/6 w-24 h-24 opacity-35">
          <div 
            className="w-full h-full bg-gradient-to-tr from-blog-accent/30 to-blog-primary/25 
                       transform -rotate-30 animate-float-slow shadow-md"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              animationDelay: '1s'
            }}
          />
        </div>

        {/* Medium floating prism 5 - More visible */}
        <div className="absolute bottom-1/4 left-1/6 w-40 h-40 opacity-45">
          <div 
            className="w-full h-full bg-gradient-to-bl from-blog-primary/30 via-transparent to-blog-accent/25 
                       transform rotate-75 animate-float-medium shadow-lg"
            style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              animationDelay: '3s',
              filter: 'blur(0.5px)'
            }}
          />
        </div>

        {/* Small accent prism 6 - Enhanced */}
        <div className="absolute top-2/3 left-2/3 w-20 h-20 opacity-40">
          <div 
            className="w-full h-full bg-gradient-to-r from-blog-accent/40 to-blog-primary/30 
                       transform rotate-60 animate-float-fast shadow-md"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animationDelay: '0.5s'
            }}
          />
        </div>

        {/* Additional prisms for more visual impact */}
        <div className="absolute top-1/3 left-1/2 w-16 h-16 opacity-30">
          <div 
            className="w-full h-full bg-gradient-to-tl from-blog-primary/35 to-transparent 
                       transform -rotate-15 animate-float-slow"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              animationDelay: '5s'
            }}
          />
        </div>

        <div className="absolute bottom-1/3 right-2/3 w-28 h-28 opacity-35">
          <div 
            className="w-full h-full bg-gradient-to-br from-blog-accent/30 to-blog-primary/20 
                       transform rotate-90 animate-float-medium shadow-md"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              animationDelay: '2.5s'
            }}
          />
        </div>
        
        {/* New central prism for focal point */}
        <div className="absolute top-1/2 left-1/2 w-36 h-36 opacity-25 -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-full h-full bg-gradient-to-r from-blog-primary/20 via-blog-accent/30 to-blog-primary/20 
                       transform rotate-12 animate-float-slow shadow-xl"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animationDelay: '1.5s',
              filter: 'blur(2px)'
            }}
          />
        </div>
      </div>

      {/* Enhanced overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10" />
    </div>
  );
};

// Add custom animations to your CSS
export const prismAnimations = `
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg));
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translateY(0px) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-15px) rotate(calc(var(--rotation, 0deg) + 3deg));
  }
}

@keyframes float-fast {
  0%, 100% {
    transform: translateY(0px) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-10px) rotate(calc(var(--rotation, 0deg) + 2deg));
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}
`;