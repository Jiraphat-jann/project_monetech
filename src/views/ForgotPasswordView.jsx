import React, { useState, useRef } from 'react';

export default function ForgotPasswordView({ onNavigate, isDarkMode }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefs = useRef([]);

  // จัดการการพิมพ์ตัวเลข OTP แล้วเด้งไปช่องถัดไป
  const handleOtpChange = (val, index) => {
    if (!/^\d*$/.test(val)) return; // รับเฉพาะตัวเลข

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // เด้งไปช่องถัดไปเมื่อพิมพ์เสร็จ
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // จัดการกดปุ่ม Backspace ให้ถอยกลับมาช่องก่อนหน้า
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      alert('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert('กรุณากรอกรหัสผ่านใหม่');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    alert('รีเซ็ตรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่');
    onNavigate('login');
  };

  return (
    <section className="flex-1 flex flex-col px-5 pt-3 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center relative mb-1">
        <button 
          type="button"
          onClick={() => onNavigate('login')} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className={`text-lg font-bold text-center flex-1 pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          รีเซ็ตรหัสผ่าน
        </h2>
      </div>

      {/* Hero Icon & Text */}
      <div className="flex flex-col items-center text-center pt-2 pb-1 space-y-2">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
          isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-500'
        }`}>
          <span className="material-symbols-outlined text-3xl font-semibold">key</span>
        </div>
        <div>
          <h3 className={`text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            ลืมรหัสผ่านใช่ไหม?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            กรอกอีเมลเพื่อรับรหัส OTP ยืนยันตัวตน
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleResetPassword} className="space-y-3.5 flex-1 flex flex-col pt-1">
        {/* อีเมล */}
        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            อีเมล
          </label>
          <input 
            type="email" 
            placeholder="name@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`} 
            required
          />
        </div>

        {/* รหัส OTP (6 หลัก) */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            รหัส OTP (6 หลัก)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full h-12 text-center text-base font-bold rounded-xl border-2 outline-none transition ${
                  digit 
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' 
                    : isDarkMode 
                      ? 'border-slate-700 bg-slate-800 text-white focus:border-emerald-500' 
                      : 'border-emerald-500/60 bg-white text-slate-900 focus:border-emerald-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* รหัสผ่านใหม่ */}
        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            รหัสผ่านใหม่
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`} 
            required
          />
        </div>

        {/* ยืนยันรหัสผ่านใหม่อีกครั้ง */}
        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            ยืนยันรหัสผ่านใหม่อีกครั้ง
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`} 
            required
          />
        </div>

        {/* ปุ่มบันทึกรหัสผ่านใหม่ */}
        <div className="mt-auto pt-4">
          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow hover:bg-emerald-600 active:scale-[0.99] transition text-sm"
          >
            บันทึกรหัสผ่านใหม่
          </button>
        </div>
      </form>
    </section>
  );
}