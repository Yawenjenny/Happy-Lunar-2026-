import React from 'react';
import SpringRunnerGame from './components/SpringRunnerGame';

const App: React.FC = () => {
  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[#8F1E1A] relative overflow-hidden touch-none">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')] opacity-10 pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6 drop-shadow-sm tracking-wide z-10 pointer-events-none select-none">
        马年大吉
      </h1>

      <div className="z-10 shadow-2xl rounded-xl overflow-hidden border-4 border-yellow-600 bg-[#8F1E1A] w-full max-w-[800px] mx-4">
        <SpringRunnerGame />
      </div>

      <div className="mt-4 flex flex-col items-center z-10 text-center pointer-events-none select-none">
        <p className="text-yellow-200/60 text-sm font-medium">
          Tap screen or Spacebar to Jump
        </p>
        <p className="text-yellow-200/50 text-xs mt-1">
          try to get the yuanbao and avoid the mountain
        </p>
      </div>
    </div>
  );
};

export default App;