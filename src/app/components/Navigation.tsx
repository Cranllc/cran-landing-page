import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#D0C4B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D64436] rounded-2xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="white" fillOpacity="0.3"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              <span className="text-2xl text-[#1a1a1a] font-medium">Cran</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors">
              How It Works
            </a>
            <a href="#mission" className="text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors">
              Mission
            </a>
            <Button className="bg-[#D64436] hover:bg-[#B83A2E] text-white rounded-full px-6">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#1a1a1a]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1a1a1a]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#D0C4B8]">
          <div className="px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#mission"
              className="block text-[#6B5D5A] hover:text-[#1a1a1a] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Mission
            </a>
            <Button className="w-full bg-[#D64436] hover:bg-[#B83A2E] text-white rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}