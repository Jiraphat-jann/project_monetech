import React from 'react';

export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur border-t border-slate-200 flex justify-around items-center px-4 z-40">
      <button 
        onClick={() => onNavigate('home')} 
        className={`flex flex-col items-center justify-center w-16 ${currentScreen === 'home' ? 'text-emerald-500' : 'text-slate-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'home' ? 'icon-fill' : ''}`}>home</span>
        <span className="text-[11px] font-semibold mt-0.5">หน้าหลัก</span>
      </button>

      <div className="relative -top-5">
        <button 
          onClick={() => onNavigate('expense')} 
          className="w-14 h-14 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      <button 
        onClick={() => onNavigate('goals')} 
        className={`flex flex-col items-center justify-center w-16 ${currentScreen === 'goals' ? 'text-emerald-500' : 'text-slate-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'goals' ? 'icon-fill' : ''}`}>target</span>
        <span className="text-[11px] font-semibold mt-0.5">เป้าหมาย</span>
      </button>
    </nav>
  );
}