import React, { useState, useEffect } from 'react';

export default function StatusBar() {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 pt-3 pb-2 text-xs font-semibold text-slate-800 shrink-0 z-50 bg-inherit select-none">
      <span>{timeStr}</span>
      <div className="w-28 h-5 bg-slate-900 rounded-full"></div>
      <div className="flex items-center gap-1.5 text-slate-700">
        <i className="fa-solid fa-signal text-[10px]"></i>
        <i className="fa-solid fa-wifi text-[10px]"></i>
        <i className="fa-solid fa-battery-full text-xs"></i>
      </div>
    </header>
  );
}