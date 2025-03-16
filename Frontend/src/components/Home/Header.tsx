import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleDot, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed w-full z-50 bg-opacity-50 backdrop-blur-[12px] border-b border-gray-700/30 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 no-underline"
        >
          <CircleDot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          ExoHabitat
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-4 lg:gap-8 list-none">
            <li>
              <Link 
                to="/planets" 
                className="text-white text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg relative 
                           hover:bg-gray-800/50 
                           transition-all duration-300 
                           group"
              >
                Planets
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                 h-0.5 bg-blue-500 
                                 group-hover:w-full 
                                 w-0 transition-all duration-300"/>
              </Link>
              </li>
              <li>
              <Link 
                to="/solar" 
                className="text-white text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg relative 
                           hover:bg-gray-800/50 
                           transition-all duration-300 
                           group"
              >
                Solar System
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                 h-0.5 bg-blue-500 
                                 group-hover:w-full 
                                 w-0 transition-all duration-300"/>
              </Link>
            </li>
            <li>
              <Link 
                to="/simulation" 
                className="text-white text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg relative 
                           hover:bg-gray-800/50 
                           transition-all duration-300 
                           group"
              >
                Simulation
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                 h-0.5 bg-blue-500 
                                 group-hover:w-full 
                                 w-0 transition-all duration-300"/>
              </Link>
            </li>
            <li>
              <Link 
                to="/compare" 
                className="text-white text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg relative 
                           hover:bg-gray-800/50 
                           transition-all duration-300 
                           group"
              >
                Compare
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                 h-0.5 bg-blue-500 
                                 group-hover:w-full 
                                 w-0 transition-all duration-300"/>
              </Link>
            </li>
            <li>
              <Link 
                to="/analysis" 
                className="text-white text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg relative 
                           hover:bg-gray-800/50 
                           transition-all duration-300 
                           group"
              >
                Analysis
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                                 h-0.5 bg-blue-500 
                                 group-hover:w-full 
                                 w-0 transition-all duration-300"/>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/90 backdrop-blur-md">
            <nav className="px-4 py-6">
              <ul className="flex flex-col gap-4 items-center">
                <li className="w-full text-center">
                  <Link 
                    to="/solar" 
                    className="block text-white font-medium py-3 hover:bg-gray-800/50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Solar System
                  </Link>
                </li>
                <li className="w-full text-center">
                  <Link 
                    to="/simulation" 
                    className="block text-white font-medium py-3 hover:bg-gray-800/50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Simulation
                  </Link>
                </li>
                <li className="w-full text-center">
                  <Link 
                    to="/compare" 
                    className="block text-white font-medium py-3 hover:bg-gray-800/50 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Compare
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;