import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navigate = useNavigate();
  
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
          <a href="#" className="text-white hover:text-yellow-200 font-medium transition-colors" onClick={() => {
            navigate('/')
          }}>
            Home
          </a>
          <a href="#" className="text-white hover:text-yellow-200 font-medium transition-colors"onClick={() => {
            navigate('/favorites')
          }}>
            Favorites
          </a>
        </nav>
        
        <button className="md:hidden text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}