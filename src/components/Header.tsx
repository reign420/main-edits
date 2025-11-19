import React, { useState } from 'react';
import { Shield, Phone, Mail, Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: 'home' | 'quote' | 'learn' | 'careers') => void;
  currentSection: string;
}

export default function Header({ onNavigate, currentSection }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (section: 'home' | 'quote' | 'learn' | 'careers') => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-slate-900 shadow-xl sticky top-0 z-50 border-b-4 border-teal-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2.5 rounded-xl shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">The Reyes Agency</h1>
              <p className="text-sm text-teal-400 font-medium">Securing Your Tomorrow</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentSection === 'home'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-teal-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentSection === 'quote'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-teal-400'
              }`}
            >
              Get Quote
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentSection === 'learn'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-teal-400'
              }`}
            >
              Learn About Us
            </button>
            <button
              onClick={() => onNavigate('careers')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentSection === 'careers'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-teal-400'
              }`}
            >
              Apply Here
            </button>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2 hover:text-teal-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span>(307) 309-1686</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-teal-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@thereyesagency.com</span>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2 bg-slate-800 rounded-xl p-3">
              <button
                onClick={() => handleMobileNavigate('home')}
                className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left ${
                  currentSection === 'home'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-teal-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleMobileNavigate('quote')}
                className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left ${
                  currentSection === 'quote'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-teal-400'
                }`}
              >
                Get Quote
              </button>
              <button
                onClick={() => handleMobileNavigate('learn')}
                className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left ${
                  currentSection === 'learn'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-teal-400'
                }`}
              >
                Learn About Us
              </button>
              <button
                onClick={() => handleMobileNavigate('careers')}
                className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left ${
                  currentSection === 'careers'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-teal-400'
                }`}
              >
                Apply Here
              </button>

              <div className="pt-3 border-t border-slate-700 mt-3 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-300 px-4 py-2">
                  <Phone className="h-4 w-4" />
                  <span>(307) 309-1686</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-300 px-4 py-2">
                  <Mail className="h-4 w-4" />
                  <span>info@thereyesagency.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
