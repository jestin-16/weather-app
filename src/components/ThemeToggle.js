import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 transition-all duration-300 ${
            darkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
          }`} 
          size={24} 
        />
        <Moon 
          className={`absolute inset-0 transition-all duration-300 ${
            darkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`} 
          size={24} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
