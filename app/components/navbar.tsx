import { Link } from "wouter";
import { Brain, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isScrolled?: boolean;
}

export function Navbar({ isScrolled = false }: NavbarProps) {
  const [internalScrolled, setInternalScrolled] = useState(isScrolled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isScrolled === undefined) {
      const handleScroll = () => {
        setInternalScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isScrolled]);

  const scrollState = isScrolled ?? internalScrolled;

  const navItems = ['Contract Builder', 'Explorer', 'Templates', 'Community'];

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full border-b border-purple-500/10 backdrop-blur-md z-50 
      transition-all duration-300 ${scrollState ? 'bg-black/80 py-2 sm:py-3' : 'bg-transparent py-3 sm:py-4'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center 
              border border-purple-500/20">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">
              Stark<span className="text-purple-400"> Agents</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-white/80 hover:text-purple-400 
                  hover:-translate-y-0.5 transition-all duration-200"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-purple-400 focus:ring-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out transform ${
            isMobileMenuOpen 
              ? "max-h-[24rem] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-purple-500/20 mt-2">
            {navItems.map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-gray-300 hover:text-purple-400 hover:bg-purple-500/5"
                >
                  {item}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
