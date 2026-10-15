import React, { useState } from 'react';

export default function LoginView({ onNavigate, isDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    onNavigate('home');
  };

  const handleBiometricLogin = () => {
    onNavigate('home');
  };

  return (
    <section className="flex-1 flex flex-col justify-between px-6 pt-8 pb-10">
      {/* Brand & Logo Header (ขนาดใหญ่เท่าเดิม) */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-4xl font-bold">query_stats</span>
        </div>
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Monetech
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            จัดการเรื่องเงินในชีวิตประจำวัน ให้เป็นเรื่องง่าย
          </p>
        </div>
      </div>

      {/* Form Section (ความสูง input และขนาดปุ่มใหญ่เต็มตา) */}
      <form onSubmit={handleLogin} className="space-y-4 my-auto py-2">
        {/* ช่องกรอกอีเมล */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
            อีเมล
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl pointer-events-none">
              mail
            </span>
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
              required
            />
          </div>
        </div>

        {/* ช่องกรอกรหัสผ่าน */}
        <div>
          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
            รหัสผ่าน
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-amber-500 text-xl pointer-events-none">
              lock
            </span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
              required
            />
          </div>
          {/* ลิงก์ลืมรหัสผ่าน */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>
        </div>

        {/* ปุ่มเข้าสู่ระบบ */}
        <button
          type="submit"
          className="w-full bg-[#0d1322] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 active:scale-[0.99] transition text-sm tracking-wide mt-2"
        >
          เข้าสู่ระบบ (LOG IN)
        </button>
      </form>

      {/* Footer สแกนนิ้ว & สมัครสมาชิก */}
      <div className="flex flex-col items-center space-y-3 pt-2">
        <button
          type="button"
          onClick={handleBiometricLogin}
          className={`w-14 h-14 rounded-full border flex items-center justify-center transition shadow-sm hover:scale-105 active:scale-95 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700' 
              : 'bg-indigo-50/60 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
          }`}
          title="สแกนนิ้วเข้าใช้งาน"
        >
          <span className="material-symbols-outlined text-2xl">fingerprint</span>
        </button>
        <span className="text-xs text-slate-400 font-medium">สแกนนิ้วเข้าใช้งานด่วน</span>

        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          ยังไม่มีบัญชี?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-bold text-emerald-500 hover:text-emerald-600 underline ml-1"
          >
            ลงทะเบียนใหม่
          </button>
        </p>
      </div>
    </section>
  );
}