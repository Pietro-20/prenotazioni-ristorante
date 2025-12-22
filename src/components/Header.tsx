import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { AdminIcon } from './icons/AdminIcon';

interface HeaderProps {
  currentView: 'user' | 'admin';
  setView: (view: 'user' | 'admin') => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, onAdminClick }) => {
  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => setView('user')}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-yellow-700 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <span className="text-black font-serif font-bold text-xl">R</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">
              PRENOTAZIONE <span className="text-gold-400">RISTORANTE</span>
            </h1>
          </div>
          
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setView('user')}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium tracking-wide
                ${currentView === 'user' 
                  ? 'text-black bg-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Prenota</span>
            </button>
            <button
              onClick={onAdminClick}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-medium tracking-wide
                ${currentView === 'admin' 
                  ? 'text-black bg-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <AdminIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Gestione</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
