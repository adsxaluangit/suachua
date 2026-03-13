
import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
  onNewRequestClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewRequestClick, onLogout }) => {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 6l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
            </div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
                Dashboard
            </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-gray-200">Quản trị viên</span>
                <span className="text-[10px] text-orange-500 font-bold flex items-center bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 animate-pulse"></span> ONLINE
                </span>
            </div>
            
            <button
            onClick={onNewRequestClick}
            className="flex items-center bg-blue-600 text-white font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
            <PlusIcon className="w-5 h-5 md:mr-2" />
            <span className="hidden sm:inline">Tạo mới</span>
            </button>

            <button
                onClick={onLogout}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-all border border-gray-800 hover:border-red-600/40"
                title="Đăng xuất"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
