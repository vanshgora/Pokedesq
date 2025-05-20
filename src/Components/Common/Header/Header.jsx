import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [scrolled, mobileMenuOpen]);

  const navigate = useNavigate();
  
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2 shadow-lg bg-red-400' : 'py-3 bg-gradient-to-r from-red-400 to-red-500'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative mr-3 w-8 h-8">
            <div className="absolute top-0 left-0 right-0 h-4 bg-red-700 rounded-t-full"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-b-full"></div>
            <div className="absolute top-3 left-3 w-2 h-2 bg-white rounded-full z-10"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>
          </div>
          
          <h1 className="font-extrabold text-4xl text-white uppercase tracking-wider">
            Poke<span className="text-yellow-300">Desq</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a
            href="#"
            className="text-white hover:text-yellow-200 font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-yellow-200 font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/favorites');
            }}
          >
            Favorites
          </a>
          <a
            href="#"
            className="text-white hover:text-yellow-200 font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/compare');
            }}
          >
            Compare
          </a>
          <a
            href="#"
            className="text-white hover:text-yellow-200 font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/explore-pokeworld');
            }}
          >
            Pokeworld
          </a>
        </nav>
        
        <button 
          className={`md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none transition-all duration-200 ${mobileMenuOpen ? 'transform rotate-90' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`bg-white block transition-all duration-300 ease-in-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
          <span className={`bg-white block transition-all duration-300 ease-in-out h-0.5 w-6 rounded-sm my-0.5 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-white block transition-all duration-300 ease-in-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
        </button>
      </div>
      
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      ></div>
      
      <div 
        className={`fixed top-0 right-0 z-50 w-64 h-full bg-red-500 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-red-600">
            <div className="text-white font-bold text-xl">Menu</div>
            <button 
              className="text-white focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
            <a
              href="#"
              className="block py-2 px-4 text-white hover:bg-red-600 rounded transition-colors text-lg font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
            >
              Home
            </a>
            <a
              href="#"
              className="block py-2 px-4 text-white hover:bg-red-600 rounded transition-colors text-lg font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/favorites');
              }}
            >
              Favorites
            </a>
            <a
              href="#"
              className="block py-2 px-4 text-white hover:bg-red-600 rounded transition-colors text-lg font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/compare');
              }}
            >
              Compare
            </a>
            <a
              href="#"
              className="block py-2 px-4 text-white hover:bg-red-600 rounded transition-colors text-lg font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/explore-pokeworld');
              }}
            >
              Pokeworld
            </a>
          </nav>
          
          <div className="p-4 border-t border-red-600">
            <div className="text-white text-sm">PokeDesq © 2025</div>
          </div>
        </div>
      </div>
    </header>
  );
}