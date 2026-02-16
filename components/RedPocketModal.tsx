import React from 'react';
import { COLORS } from '../constants';

interface RedPocketModalProps {
  score: number;
  onRestart: () => void;
}

const RedPocketModal: React.FC<RedPocketModalProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-300">
      {/* Red Envelope Container */}
      <div className="relative bg-red-600 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-500 transform transition-all scale-100">
        
        {/* Envelope Flap (Visual) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-red-700 rounded-b-[50%] scale-x-125 translate-y-[-50%] z-0 border-b-2 border-red-800/20"></div>

        <div className="relative z-10 flex flex-col items-center p-8 pt-16 text-center">
          
          {/* Decorative Gold Icon */}
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-yellow-200">
            <span className="text-3xl">福</span>
          </div>

          <h2 className="text-2xl font-bold text-yellow-100 mb-2 font-serif">
            New Year Fortune
          </h2>
          
          <div className="text-white/80 text-sm mb-6">
            You collected
          </div>

          <div className="text-5xl font-black text-yellow-300 mb-8 drop-shadow-md">
            ¥{score}
          </div>

          <button
            onClick={onRestart}
            className="group relative px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold rounded-full shadow-lg transform transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-200"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Play Again
            </span>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-red-800 to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default RedPocketModal;